const ObjUtils = require('utils/ObjUtils')
const FunctionalityFactory = require('functionalities/factories/FunctionalityFactory')
const {
  TemperatureSensorSeeder,
  HeaterActuatorSeeder,
  IntervalOutSeeder,
  PIDControllerSeeder,
  PushOutSeeder,
  PushInSeeder,
  UnknownSensorSeeder,
  UnknownActuatorSeeder,
} = require('seeders/functionalities')
const functionalitiesIndex = require('functionalities')

const {
  TemperatureSensor,
  HeaterActuator,
  IntervalOut,
  PIDController,
  PushOut,
  PushIn,
  UnknownSensor,
  UnknownActuator,
} = functionalitiesIndex

describe('the functionality factory', () => {

  describe('new', () => {

    it('throws useful error when the type is not recognized', () => {
      const bogusType = 'merkel' // not that Angie, herself, is bogus...
      const fctData = TemperatureSensorSeeder.generate({ type: bogusType })

      expect(() => {
        FunctionalityFactory.new(fctData)
      }).toThrow(`Functionality type not supported ${bogusType}`)

      expect(() => {
        FunctionalityFactory.new({ ...fctData, type: false })
      }).toThrow('Functionality type not supported FALSEY')
    })

    it('throws useful error when the subType is not recognized', () => {
      const bogusSubType = 'merkel'
      const fctData = TemperatureSensorSeeder.generate({ subType: bogusSubType })

      expect(() => {
        FunctionalityFactory.new(fctData)
      }).toThrow(`Functionality subType not supported ${bogusSubType}`)

      expect(() => {
        FunctionalityFactory.new({ ...fctData, subType: false })
      }).toThrow('Functionality subType not supported FALSEY')
    })

    it('throws error when the subType is not recognized', () => {
      const bogusType = 'Schröder'
      const fctData = PIDControllerSeeder.generate({ subType: bogusType })

      expect(() => {
        FunctionalityFactory.new({ ...fctData })
      }).toThrow(`Functionality subType not supported ${bogusType}`)
    })

    it('assigns an empty array to slots if none are provided', () => {
      const fctData = TemperatureSensorSeeder.generate()
      delete fctData.slots
      const fct = FunctionalityFactory.new(fctData)

      expect(fct.slots).toStrictEqual([])
    })

    const SUB_FUNCTIONALITIES = [
      {
        SubClass: HeaterActuator,
        SubClassSeeder: HeaterActuatorSeeder,
        expectedIsVirtual: false,
      },
      {
        SubClass: IntervalOut,
        SubClassSeeder: IntervalOutSeeder,
        expectedIsVirtual: true,
      },
      {
        SubClass: PIDController,
        SubClassSeeder: PIDControllerSeeder,
        expectedIsVirtual: true,
      },
      {
        SubClass: TemperatureSensor,
        SubClassSeeder: TemperatureSensorSeeder,
        expectedIsVirtual: false,
      },
      {
        SubClass: PushOut,
        SubClassSeeder: PushOutSeeder,
        expectedIsVirtual: true,
      },
      {
        SubClass: PushIn,
        SubClassSeeder: PushInSeeder,
        expectedIsVirtual: true,
      },
      {
        SubClass: UnknownSensor,
        SubClassSeeder: UnknownSensorSeeder,
        expectedIsVirtual: false,
      },
      {
        SubClass: UnknownActuator,
        SubClassSeeder: UnknownActuatorSeeder,
        expectedIsVirtual: false,
      },
    ]

    it('has a test for each exported sub functionality', () => {
      /* if you are here because this test is failing,
       * either add the new export as a NON_SUB_CLASS_EXPORTS
       * or ensure that the new sub functionality is under
       * test by adding its seeder to the SUB_FUNCTIONALITIES
       * array
       */
      const NON_SUB_CLASS_EXPORTS = [
        functionalitiesIndex.FunctionalityFactory,
        functionalitiesIndex.Functionalty,
        functionalitiesIndex.Sensor,
        functionalitiesIndex.Actuator,
      ]

      expect(SUB_FUNCTIONALITIES).toHaveLength(
        Object.keys(functionalitiesIndex).length - NON_SUB_CLASS_EXPORTS.length,
      )
    })

    SUB_FUNCTIONALITIES.forEach(({ SubClass, SubClassSeeder, expectedIsVirtual }) => {

      describe(`when making a(n) ${SubClass.name}`, () => {
        const fctSubClassData = SubClassSeeder.generate()
        const fct = FunctionalityFactory.new(fctSubClassData)

        describe('with .newAndAssertStructure', () => {
          it('throws error if it gets bogus data', () => {
            const bogusName = 666
            const badBadData = SubClassSeeder.generate({ name: bogusName })

            expect(() => {
              FunctionalityFactory.newAndAssertStructure(badBadData)
            }).toThrow('"name" must be a string')
          })
        })

        it('creates the expected slot instances', () => {
          expect(fct.slotTypes().sort())
            .toStrictEqual(SubClassSeeder.SLOT_SEED_TYPES.sort())
        })

        it('has the expected default isVirtual flag', () => {
          const fctData = SubClassSeeder.generate()
          delete fctData.isVirtual
          const fctWithDefaultIsVirtual = FunctionalityFactory.new(fctData)

          expect(fctWithDefaultIsVirtual.isVirtual).toBe(expectedIsVirtual)
        })

        it('creates the correct functionality instance...', () => {
          expect(fct instanceof SubClass).toBe(true)
        })

        it('...which serializes back to its original data object', () => {
          expect(fct.serialize()).toStrictEqual(fctSubClassData)
        })

        it('...which stringifies toJSON back to its original data object', () => {
          const sortedJSONData = JSON.stringify(
            ObjUtils.sortByKeys(fctSubClassData),
          )

          expect(JSON.stringify(fct)).toStrictEqual(sortedJSONData)
        })
      })
    })
  })

  describe('assertClassHasNewAndAssertStructure', () => {
    it('blows up if a class is found that does not have the .assertClassHasNewAndAssertStructure method aka does not compose JOIous', () => {
      const Class = FunctionalityFactory.SUB_TYPE_TO_CLASS.TemperatureSensor
      delete Class.newAndAssertStructure

      expect(() => {
        FunctionalityFactory.newAndAssertStructure(TemperatureSensorSeeder.generate())
      }).toThrow('must have a \'newAndAssertStructure\' method')
    })
  })
})
