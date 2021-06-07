const SlotFactory = require('slots/factories/SlotFactory')
const InSlot = require('slots/InSlot')
const OutSlot = require('slots/OutSlot')

const { InSlotSeeder, OutSlotSeeder } = require('test/seeders/slots')

describe('the slot factory', () => {

  describe('new', () => {

    it('throws error when the type is not recognized', () => {
      const inSlotData = InSlotSeeder.generate()
      const bogusType = 'merkel' // not that Angie, herself, is bogus...

      expect(() => {
        SlotFactory.new({ ...inSlotData, type: bogusType })
      }).toThrow(`Slot type not supported ${bogusType}`)

      expect(() => {
        SlotFactory.new({ ...inSlotData, type: false })
      }).toThrow('Slot type not supported FALSEY')
    })

    describe('when making InSlots', () => {
      Object.values(InSlot.DATA_TYPES).forEach(dataType => {
        describe(`of dataType: ${dataType}`, () => {
          const inSlotData = InSlotSeeder.generate({ dataType })
          const inSlot = SlotFactory.new(inSlotData)

          it('creates the correct slot type...', () => {
            expect(inSlot instanceof InSlot).toBe(true)
          })

          it('...which serializes back to its original data object', () => {
            // eslint-disable-next-line jest/prefer-strict-equal
            expect(inSlot.serialize()).toEqual(inSlotData)
          })
        })
      })
    })

    describe('when making OutSlot', () => {
      Object.values(OutSlot.DATA_TYPES).forEach(dataType => {
        describe(`of dataType: ${dataType}`, () => {
          const outSlotData = OutSlotSeeder.generate({ dataType })
          const outSlot = SlotFactory.new(outSlotData)

          it('creates the correct slot type...', () => {
            expect(outSlot instanceof OutSlot).toBe(true)
          })

          it('...which serializes back to its original data object', () => {
            // eslint-disable-next-line jest/prefer-strict-equal
            expect(outSlot.serialize()).toEqual(outSlotData)
          })
        })
      })
    })
  })
})
