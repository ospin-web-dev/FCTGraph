const Functionality = require('../../src/functionalities/Functionality')

//const validSlotData = require('../seeds/slots/valid')
//const { SlotSeeder } = require('../seeders')

describe('class Functionality', () => {

  it('is JOIous', () => {
    expect(Functionality.isJOIous).toBe(true)
  })

  describe('new', () => {
    it('throws if given an invalid data object', () => {
      expect(() => new Functionality({ slots: [] })).toThrow('"id" is required')
    })

    it('creates an object successfully when given valid data', () => {
      expect(new Functionality())
    })
  })
})
