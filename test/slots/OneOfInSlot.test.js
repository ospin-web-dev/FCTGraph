const OneOfInSlot = require('slots/OneOfInSlot')
const { OneOfInSlotSeeder } = require('seeders/slots')
const InSlot = require('../../src/slots/InSlot')

describe('the OneOfInSlot class', () => {
  describe('.constructor', () => {
    const requiredKeys = [ 'defaultValue', 'selectOptions' ]
    const forbiddenKeys = ['min', 'max']

    it('creates a oneOf slot with the expected properties', () => {
      const slotData = OneOfInSlotSeeder.generate()
      const slot = new OneOfInSlot(slotData)

      requiredKeys.forEach(key => expect(key in slot).toBe(true))
      forbiddenKeys.forEach(key => expect(key in slot).toBe(false))
    })

    it('defaults the defaultValue to null when none is provided', () => {
      const slotData = OneOfInSlotSeeder.generate()
      delete slotData.defaultValue

      const slot = new OneOfInSlot(slotData)
      expect(slot.defaultValue).toBeNull()
    })

    it('defaults the selectOptions to an empty array when none are provided', () => {
      const slotData = OneOfInSlotSeeder.generate()
      delete slotData.selectOptions

      const slot = new OneOfInSlot(slotData)
      expect(slot.selectOptions).toStrictEqual([])
    })
  })
})
