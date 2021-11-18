const IntegerInSlot = require('slots/IntegerInSlot')
const { IntegerInSlotSeeder } = require('seeders/slots')

describe('the IntegerInSlot class', () => {
  describe('.assertValidDataAndNew', () => {
    it('throws when max is below min', () => {
      const slotData = IntegerInSlotSeeder.generate()
      slotData.max = 100
      slotData.min = 200

      expect(() => IntegerInSlot.assertValidDataAndNew(slotData)).toThrow(/max/)
    })

    it('throws when defaultValue is above max', () => {
      const slotData = IntegerInSlotSeeder.generate()
      slotData.max = 100
      slotData.defaultValue = 200

      expect(() => IntegerInSlot.assertValidDataAndNew(slotData)).toThrow(/max/)
    })

    it('throws when defaultValue is below min', () => {
      const slotData = IntegerInSlotSeeder.generate()
      slotData.min = 300
      slotData.defaultValue = 200

      expect(() => IntegerInSlot.assertValidDataAndNew(slotData)).toThrow(/min/)
    })

    it('throws when defaultValue is a float number', () => {
      const slotData = IntegerInSlotSeeder.generate()
      slotData.defaultValue = 200.1

      expect(() => IntegerInSlot.assertValidDataAndNew(slotData)).toThrow(/defaultValue/)
    })

    it('throws when min is a float number', () => {
      const slotData = IntegerInSlotSeeder.generate()
      slotData.min = 200.1

      expect(() => IntegerInSlot.assertValidDataAndNew(slotData)).toThrow(/min/)
    })

    it('throws when max is a float number', () => {
      const slotData = IntegerInSlotSeeder.generate()
      slotData.max = 200.1

      expect(() => IntegerInSlot.assertValidDataAndNew(slotData)).toThrow(/max/)
    })
  })

  describe('.constructor', () => {
    const requiredKeys = [ 'defaultValue', 'min', 'max' ]
    const forbiddenKeys = ['selectOptions']

    it('creates a integer slot with the expected properties', () => {
      const slotData = IntegerInSlotSeeder.generate()
      const slot = new IntegerInSlot(slotData)

      requiredKeys.forEach(key => expect(key in slot).toBe(true))
      forbiddenKeys.forEach(key => expect(key in slot).toBe(false))
    })

    it('sets tareable to false by default', () => {
      const slotData = IntegerInSlotSeeder.generate()
      delete slotData.tareable

      const slot = new IntegerInSlot(slotData)

      expect(slot.tareable).toBe(false)
    })

    it('sets defaultValue per default to null', () => {
      const slotData = IntegerInSlotSeeder.generate()
      delete slotData.defaultValue

      const slot = new IntegerInSlot(slotData)

      expect(slot.defaultValue).toBeNull()
    })

    it('sets min per default to null', () => {
      const slotData = IntegerInSlotSeeder.generate()
      delete slotData.min

      const slot = new IntegerInSlot(slotData)

      expect(slot.min).toBeNull()
    })

    it('sets max per default to null', () => {
      const slotData = IntegerInSlotSeeder.generate()
      delete slotData.max

      const slot = new IntegerInSlot(slotData)

      expect(slot.max).toBeNull()
    })

    it('allows min and max to be null', () => {
      const slotData = IntegerInSlotSeeder.generate()
      delete slotData.max
      delete slotData.min

      const slot = new IntegerInSlot(slotData)

      expect(slot.max).toBeNull()
      expect(slot.min).toBeNull()
    })

  })
})
