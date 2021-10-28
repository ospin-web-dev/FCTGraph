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

    it('default the defaultValue to null when none is provided', () => {
      const slotData = OneOfInSlotSeeder.generate()
      delete slotData.defaultValue

      const slot = new OneOfInSlot(slotData)
      expect(slot.defaultValue).toBeNull()
    })

    describe('.isControllerParameter', () => {
      it('should return true for slots with the displayType controller paramter', () => {
        const slot1 = new OneOfInSlot(
          OneOfInSlotSeeder.generate({displayType: InSlot.CONTROLLER_PARAMETER_DISPLAY_TYPE })
        )
        const slot2 = new OneOfInSlot(
          OneOfInSlotSeeder.generate({displayType: 'temperature' })
        )

        expect(slot1.isControllerParameter).toBe(true)
        expect(slot2.isControllerParameter).toBe(false)

      });
    })

  })
})
