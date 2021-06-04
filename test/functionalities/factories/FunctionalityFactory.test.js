const FunctionalityFactory = require('functionalities/factories/FunctionalityFactory')
const {
  TemperatureSensorSeeder,
  HeaterActuatorSeeder,
  IntervalOutSeeder,
  PIDControllerSeeder,
  PushOutSeeder,
} = require('test/seeders/functionalities')
const {
  TemperatureSensor,
  HeaterActuator,
  IntervalOut,
  PIDController,
  PushOut,
} = require('functionalities')
const ObjUtils = require('utils/ObjUtils')

describe('the functionality factory', () => {

  describe('new', () => {

    it('throws useful error when the type is not recognized', () => {
      const bogusType = 'merkel' // not that Angie, herself, is bogus...
      const funcData = TemperatureSensorSeeder.generate({ type: bogusType })

      expect(() => {
        FunctionalityFactory.new(funcData)
      }).toThrow(`Functionality type not supported ${bogusType}`)
    })

    it('throws useful error when the subType is not recognized', () => {
      const bogusSubType = 'merkel'
      const funcData = TemperatureSensorSeeder.generate({ subType: bogusSubType })

      expect(() => {
        FunctionalityFactory.new(funcData)
      }).toThrow(`Functionality subType not supported ${bogusSubType}`)
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
        SubClass: PushOut,
        SubClassSeeder: PushOutSeeder,
      },
      {
        SubClass: TemperatureSensor,
        SubClassSeeder: TemperatureSensorSeeder,
      },
    ]

    SUB_FUNCTIONALITY_SEEDERS.forEach(({ SubClass, SubClassSeeder }) => {

      describe(`when making a(n) ${SubClass.name}`, () => {
        const funcSubClassData = SubClassSeeder.generate()
        const func = FunctionalityFactory.new(funcSubClassData)

        it('throws error if it gets bogus data', () => {
          const bogusName = 666
          const badBadData = SubClassSeeder.generate({ name: bogusName })

          expect(() => {
            FunctionalityFactory.new(badBadData)
          }).toThrow('"name" must be a string')
        })

        it('creates the expected slot instances', () => {
          expect(func.slotTypes().sort())
            .toStrictEqual(SubClassSeeder.SLOT_SEED_TYPES.sort())
        })

        it('creates the correct functionality instance...', () => {
          expect(func instanceof SubClass).toBe(true)
        })

        it('...which serializes back to its original data object', () => {
          expect(func.serialize()).toStrictEqual(funcSubClassData)
        })

        it('...which stringifies toJSON back to its original data object', () => {
          const sortedJSONData = JSON.stringify(
            ObjUtils.sortByKeys(funcSubClassData),
          )

          expect(JSON.stringify(func)).toStrictEqual(sortedJSONData)
        })
      })
    })
  })
})
