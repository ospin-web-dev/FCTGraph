/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
const faker = require('faker')
const RandomDataGenerator = require('../../src/utils/RandomDataGenerator')
const RegexUtils = require('../../src/utils/RegexUtils')

describe('the RandomDataGenerator', () => {
  const numberOfTestRuns = 100

  describe('.uuid', () => {
    it('should return a uuid', () => {
      for (let index = 0; index < numberOfTestRuns; index++) {
        const uuid = RandomDataGenerator.uuid()
        expect(typeof (uuid)).toBe('string')
        expect(uuid).toMatch(RegexUtils.UUIDV4)
      }
    })

  })

  describe('.boolean', () => {
    it('should return a boolean', () => {
      for (let index = 0; index < numberOfTestRuns; index++) {
        expect(typeof (RandomDataGenerator.boolean())).toBe('boolean')
      }
    })
  })

  describe('.integer', () => {
    it('should generate an integer', () => {
      for (let index = 0; index < numberOfTestRuns; index++) {
        expect(Number.isInteger(RandomDataGenerator.integer())).toBe(true)
      }
    })

    describe('when given a min and max', () => {
      it('should generate numbers between those', () => {
        for (let index = 0; index < numberOfTestRuns; index++) {
          const min = faker.datatype.number()
          const max = faker.datatype.number() + min
          const generatedNumber = RandomDataGenerator.integer({ min, max })
          expect(generatedNumber <= max).toBe(true)
          expect(generatedNumber >= min).toBe(true)
        }
      })
    })

  })

  describe('.float', () => {
    it('should generate a float', () => {
      for (let index = 0; index < numberOfTestRuns; index++) {
        const randomFloat = RandomDataGenerator.float()
        expect(Number.isNaN(Number.parseFloat(randomFloat))).toBe(false)
        expect(Number.isInteger(randomFloat)).toBe(false)
      }
    })

    describe('when given a min and max', () => {
      it('should generate numbers between those', () => {
        for (let index = 0; index < numberOfTestRuns; index++) {
          const min = faker.datatype.number()
          const max = faker.datatype.number() + min
          const generatedNumber = RandomDataGenerator.float({ min, max })
          expect(generatedNumber <= max).toBe(true)
          expect(generatedNumber >= min).toBe(true)
        }
      })
    })

    describe('when given a precision', () => {
      it('should generate a float with the matching amount of decimals', () => {
        for (let index = 0; index < numberOfTestRuns; index++) {
          const precision = faker.datatype.number({ min: 1, max: 8 })
          const generatedNumber = RandomDataGenerator.float({ precision })
          expect(generatedNumber.toString().split('.')[1]).toHaveLength(precision)
        }
      })
    })
  })

  describe('.frog', () => {
    it('should return a string', () => {
      for (let index = 0; index < numberOfTestRuns; index++) {
        expect(typeof RandomDataGenerator.frog()).toBe('string')
      }
    })
  })

  describe('.arrayItem', () => {
    it('should return an item of the given array', () => {
      const array = Array.from(RandomDataGenerator.frog())
      for (let index = 0; index < numberOfTestRuns; index++) {
        const item = RandomDataGenerator.arrayItem(array)
        expect(array).toContain(item)
      }
    })
  })

  describe('.hackerNoun', () => {
    it('should return a string', () => {
      for (let index = 0; index < numberOfTestRuns; index++) {
        expect(typeof RandomDataGenerator.hackerNoun()).toBe('string')
      }
    })
  })

  describe('.jobDescriptor', () => {
    it('should return a string', () => {
      for (let index = 0; index < numberOfTestRuns; index++) {
        expect(typeof RandomDataGenerator.jobDescriptor()).toBe('string')
      }
    })
  });
})
