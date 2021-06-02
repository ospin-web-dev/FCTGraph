const FunctionalityFactory = require('functionalities/factories/FunctionalityFactory')
const InFunctionality = require('functionalities/InFunctionality')
const Functionality = require('functionalities/Functionality')

// eslint-disable-next-line import/no-unresolved
const { InFunctionalitySeeder, FunctionalitySeeder } = require('test/seeders/functionalities')

describe('the slot factories', () => {

  describe('new', () => {

    it('throws error when the type is not recognized', () => {
      const inFunctionalityData = InFunctionalitySeeder.generate()
      const bogusType = 'merkel' // not that Angie, herself, is bogus...

      expect(() => {
        FunctionalityFactory.new({ ...inFunctionalityData, type: bogusType })
      }).toThrow(`Functionality type not supported ${bogusType}`)
    })

    describe('when making InFunctionalitys', () => {
      Object.values(InFunctionality.DATA_TYPES).forEach(dataType => {
        describe(`of dataType: ${dataType}`, () => {
          const inFunctionalityData = InFunctionalitySeeder.generate({ dataType })
          const inFunctionality = FunctionalityFactory.new(inFunctionalityData)

          it('creates the correct slot type...', () => {
            expect(inFunctionality instanceof InFunctionality).toBe(true)
          })

          it('...which serializes back to its original data object', () => {
            // eslint-disable-next-line jest/prefer-strict-equal
            expect(inFunctionality.serialize()).toEqual(inFunctionalityData)
          })
        })
      })
    })

    describe('when making Functionality', () => {
      Object.values(Functionality.DATA_TYPES).forEach(dataType => {
        describe(`of dataType: ${dataType}`, () => {
          const FunctionalityData = FunctionalitySeeder.generate({ dataType })
          const Functionality = FunctionalityFactory.new(FunctionalityData)

          it('creates the correct slot type...', () => {
            expect(Functionality instanceof Functionality).toBe(true)
          })

          it('...which serializes back to its original data object', () => {
            // eslint-disable-next-line jest/prefer-strict-equal
            expect(Functionality.serialize()).toEqual(FunctionalityData)
          })
        })
      })
    })
  })
})
