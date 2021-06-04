const FunctionalityFactory = require('functionalities/factories/FunctionalityFactory')
const TemperatureSensor = require('functionalities/TemperatureSensor')

const { TemperatureSensorSeeder } = require('test/seeders/functionalities')

describe('the functionality factory', () => {

  describe('new', () => {

    it('throws error when the type is not recognized', () => {
      const bogusType = 'merkel' // not that Angie, herself, is bogus...
      const funcData = TemperatureSensorSeeder.generate({ type: bogusType })

      expect(() => {
        FunctionalityFactory.new(funcData)
      }).toThrow(`Functionality type not supported ${bogusType}`)
    })

    it('throws error when the subType is not recognized', () => {
      const bogusSubType = 'merkel'
      const funcData = TemperatureSensorSeeder.generate({ subType: bogusSubType })

      expect(() => {
        FunctionalityFactory.new(funcData)
      }).toThrow(`Functionality subType not supported ${bogusSubType}`)
    })

    const subFuncs = [
      {
        SubClass: TemperatureSensor,
        SubClassSeeder: TemperatureSensorSeeder,
      },
    ]

    subFuncs.forEach(({ SubClass, SubClassSeeder }) => {

      describe(`when making a(n) ${SubClass.name}`, () => {
        const funcSubClassData = SubClassSeeder.generate()
        const func = FunctionalityFactory.new(funcSubClassData)

        it('creates the correct functionality instance...', () => {
          expect(func instanceof SubClass).toBe(true)
        })

        it('...which serializes back to its original data object', () => {
          // eslint-disable-next-line jest/prefer-strict-equal
          expect(func.serialize()).toEqual(funcSubClassData)
        })
      })
    })
  })
})
