const BooleanInSlot = require('slots/BooleanInSlot')
const { BooleanInSlotSeeder } = require('seeders/slots')

describe('the BooleanInSlot class', () => {
  describe('.constructor', () => {
    const requiredKeys = [ 'defaultValue' ]
    const forbiddenKeys = ['min', 'max', 'selectOptions']

    it('creates a boolean slot with the expected properties', () => {
      const slotData = BooleanInSlotSeeder.generate()

      const slot = new BooleanInSlot(slotData)

      requiredKeys.forEach(key => expect(key in slot).toBe(true))
      forbiddenKeys.forEach(key => expect(key in slot).toBe(false))
    })

    it('default the defaultValue to null when none is provided', () => {
      const slotData = BooleanInSlotSeeder.generate()
      delete slotData.defaultValue

      const slot = new BooleanInSlot(slotData)
      expect(slot.defaultValue).toBeNull()
    })
  })
})
