const BooleanInSlot = require('slots/BooleanInSlot')
const { InSlotSeeder } = require('seeders/slots')
/* the SlotSeeder is not present in the seeders/slots index because it
 * should not be exposed as public seeder interface */

describe('the BooleanInSlot class', () => {
  describe('.constructor', () => {
    const requiredKeys = [ 'defaultValue' ]
    const forbiddenKeys = ['min', 'max', 'selectOptions']

    it('creates a boolean slot with the expected properties', () => {
      const slotData = InSlotSeeder.generate({ dataType: BooleanInSlot.DATA_TYPE })

      const slot = new BooleanInSlot(slotData)

      requiredKeys.forEach(key => expect(key in slot).toBe(true))
      forbiddenKeys.forEach(key => expect(key in slot).toBe(false))
    })
  })
})
