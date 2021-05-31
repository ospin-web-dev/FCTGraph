const Slot = require('../../src/slots/Slot')

const { SlotSeeder } = require('../seeders')
// TODO: should not be tested. test in/outslot instead

describe('class Slot', () => {

  describe('new', () => {
    it('creates an object successfully when given valid data', () => {
      const slot = new Slot(SlotSeeder.generate())

      expect(slot instanceof Slot).toBe(true)
    })
  })
})
