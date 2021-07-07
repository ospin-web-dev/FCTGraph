const OneOfInSlot = require('slots/OneOfInSlot')
const { InSlotSeeder } = require('seeders/slots')
/* the SlotSeeder is not present in the seeders/slots index because it
 * should not be exposed as public seeder interface */

describe('the OneOfInSlot class', () => {
  describe('.constructor', () => {
    const requiredKeys = [ 'defaultValue', 'selectOptions' ]
    const forbiddenKeys = ['min', 'max']

    it('creates a oneOf slot with the expected properties', () => {
      const slotData = InSlotSeeder.generate({ dataType: OneOfInSlot.DATA_TYPE })
      const slot = new OneOfInSlot(slotData)

      requiredKeys.forEach(key => expect(key in slot).toBe(true))
      forbiddenKeys.forEach(key => expect(key in slot).toBe(false))
    })

    it('default the defaultValue to null when none is provided', () => {
      const slotData = InSlotSeeder.generate({ dataType: OneOfInSlot.DATA_TYPE })
      delete slotData.defaultValue

      const slot = new OneOfInSlot(slotData)
      expect(slot.defaultValue).toBeNull()
    })
  })
})
