import SlotFactory from 'slots/factories/SlotFactory'

const { SlotSeeder } = require('seeders')

describe('class Slot', () => {

  describe('new', () => {
    it('creates an object successfully when given valid data', () => {
      const slot = SlotFactory.new(SlotSeeder.generate())

      expect(slot instanceof Slot).toBe(true)
      console.log(slot.serialize())
    })
  })
})
