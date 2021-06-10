const FunctionalityFactory = require('functionalities/factories/FunctionalityFactory')
const {
  TemperatureSensorSeeder,
  HeaterActuatorSeeder,
  IntervalOutSeeder,
  PIDControllerSeeder,
  PushOutSeeder,
  PushInSeeder,
} = require('seeders/functionalities')
const {
  TemperatureSensor,
  HeaterActuator,
  IntervalOut,
  PIDController,
  PushOut,
  PushIn,
} = require('functionalities')
const ObjUtils = require('utils/ObjUtils')

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

    const SUB_FUNCTIONALITY_SEEDERS = [
      {
        SubClass: HeaterActuator,
        SubClassSeeder: HeaterActuatorSeeder,
      },
      {
        SubClass: IntervalOut,
        SubClassSeeder: IntervalOutSeeder,
      },
      {
        SubClass: PIDController,
        SubClassSeeder: PIDControllerSeeder,
      },
      {
        SubClass: TemperatureSensor,
        SubClassSeeder: TemperatureSensorSeeder,
      },
      {
        SubClass: PushOut,
        SubClassSeeder: PushOutSeeder,
      },
      {
        SubClass: PushIn,
        SubClassSeeder: PushInSeeder,
      },
    ]

    SUB_FUNCTIONALITY_SEEDERS.forEach(({ SubClass, SubClassSeeder }) => {

      describe(`when making a(n) ${SubClass.name}`, () => {
        const fctSubClassData = SubClassSeeder.generate()
        const fct = FunctionalityFactory.new(fctSubClassData)

        it('throws error if it gets bogus data', () => {
          const bogusName = 666
          const badBadData = SubClassSeeder.generate({ name: bogusName })

          expect(() => {
            FunctionalityFactory.new(badBadData)
          }).toThrow('"name" must be a string')
        })

        it('creates the expected slot instances', () => {
          expect(fct.slotTypes().sort())
            .toStrictEqual(SubClassSeeder.SLOT_SEED_TYPES.sort())
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
})
