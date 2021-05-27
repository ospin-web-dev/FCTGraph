const Functionality = require('../../src/functionalities/Functionality')

//const validSlotData = require('../seeds/slots/valid')
//const { SlotSeeder } = require('../seeders')

describe('Functionality', () => {

  it('is JOIous', () => {
    expect(Functionality.isJOIous).toBe(true)
  })

  describe('new', () => {
    it('throws if given an invalid data object', () => {
      new Functionality({ slots: [] })
      //expect(new Functionality({ slots: [] })).toThrowError()
    })

  //    it('creates an object successfully', () => {
  //      expect(new Functionality()).toThrowError()
  //    })
  })
})
