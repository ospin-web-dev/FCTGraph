const SlotFactory = require('slots/factories/SlotFactory')
const InSlot = require('slots/InSlot')

const { InSlotSeeder, OutSlotSeeder } = require('test/seeders/slots')

describe('the slot factories', () => {

  describe('new', () => {

    it('throws error when the type is not recognized', () => {
      const InSlotData = InSlotSeeder.generate()
      const bogusType = 'merkel' // not that Angie, herself, is bogus...

      expect(() => {
        SlotFactory.new({ ...InSlotData, type: bogusType })
      }).toThrow(`Slot type not supported ${bogusType}`)
    })

    it('creates the correct slots when given valid data', () => {
      // TODO: do for the 4 different data types
      const InSlotData = InSlotSeeder.generate({ dataType: 'float', defaultValue: 300 })
      const OutSlotData = OutSlotSeeder.generate()

      const inSlot = SlotFactory.new(InSlotData)
      const outSlot = SlotFactory.new(OutSlotData)

      expect(inSlot instanceof InSlot).toBe(true)
      expect(outSlot instanceof OutSlot).toBe(true)
    })
  })
})
