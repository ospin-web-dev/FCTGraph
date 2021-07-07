const FloatInSlot = require('slots/FloatInSlot')
const { InSlotSeeder } = require('seeders/slots')

describe('the FloatInSlot class', () => {
  describe('.constructor', () => {
    const requiredKeys = [ 'defaultValue', 'min', 'max' ]
    const forbiddenKeys = ['selectOptions']

    it('creates a float slot with the expected properties', () => {
      const slotData = InSlotSeeder.generate({ dataType: FloatInSlot.DATA_TYPE })
      const slot = new FloatInSlot(slotData)

      requiredKeys.forEach(key => expect(key in slot).toBe(true))
      forbiddenKeys.forEach(key => expect(key in slot).toBe(false))
    })

    it('sets defaultValue per default to null', () => {
      const slotData = InSlotSeeder.generate({
        dataType: FloatInSlot.DATA_TYPE,
      })
      delete slotData.defaultValue

      const slot = new FloatInSlot(slotData)

      expect(slot.defaultValue).toBeNull()
    })

    it('sets min per default to null', () => {
      const slotData = InSlotSeeder.generate({
        dataType: FloatInSlot.DATA_TYPE,
      })
      delete slotData.min

      const slot = new FloatInSlot(slotData)

      expect(slot.min).toBeNull()
    })

    it('sets max per default to null', () => {
      const slotData = InSlotSeeder.generate({
        dataType: FloatInSlot.DATA_TYPE,
      })
      delete slotData.max

      const slot = new FloatInSlot(slotData)

      expect(slot.max).toBeNull()
    })

    it('allows min and max to be null', () => {
      const slotData = InSlotSeeder.generate({
        dataType: FloatInSlot.DATA_TYPE,
      })
      delete slotData.max
      delete slotData.min

      const slot = new FloatInSlot(slotData)

      expect(slot.max).toBeNull()
      expect(slot.min).toBeNull()
    })

    it('throws when max is below min', () => {
      const slotData = InSlotSeeder.generate({ dataType: FloatInSlot.DATA_TYPE })
      slotData.max = 100.1
      slotData.min = 200.2

      expect(() => new FloatInSlot(slotData)).toThrow(/max/)
    })

    it('throws when defaultValue is above max', () => {
      const slotData = InSlotSeeder.generate({ dataType: FloatInSlot.DATA_TYPE })
      slotData.max = 100.1
      slotData.defaultValue = 200.1

      expect(() => new FloatInSlot(slotData)).toThrow(/max/)
    })

    it('throws when defaultValue is below min', () => {
      const slotData = InSlotSeeder.generate({ dataType: FloatInSlot.DATA_TYPE })
      slotData.min = 300.1
      slotData.defaultValue = 200.1

      expect(() => new FloatInSlot(slotData)).toThrow(/min/)
    })
  })
})
