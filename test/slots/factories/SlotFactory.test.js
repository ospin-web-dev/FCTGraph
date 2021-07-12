const SlotFactory = require('slots/factories/SlotFactory')
const InSlot = require('slots/InSlot')
const OneOfInSlot = require('slots/OneOfInSlot')
const BooleanInSlot = require('slots/BooleanInSlot')
const IntegerInSlot = require('slots/IntegerInSlot')
const FloatInSlot = require('slots/FloatInSlot')
const OutSlot = require('slots/OutSlot')

const {
  BooleanInSlotSeeder,
  FloatInSlotSeeder,
  IntegerInSlotSeeder,
  OneOfInSlotSeeder,
  OutSlotSeeder,
} = require('seeders/slots')

describe('the slot factory', () => {

  describe('new', () => {

    it('throws error when the type is not recognized', () => {
      const inSlotData = FloatInSlotSeeder.generate()
      const bogusType = 'merkel' // not that Angie, herself, is bogus...

      expect(() => {
        SlotFactory.new({ ...inSlotData, type: bogusType })
      }).toThrow(`Slot type not supported ${bogusType}`)

      expect(() => {
        SlotFactory.new({ ...inSlotData, type: false })
      }).toThrow('Slot type not supported FALSEY')
    })

    it('throws error when the type does not have a class defined for the provided dataType', () => {
      const inSlotData = FloatInSlotSeeder.generate()
      const bogusDataType = 'trump'

      expect(() => {
        SlotFactory.new({ ...inSlotData, dataType: bogusDataType })
      }).toThrow(`No ${bogusDataType} slot class found for ${inSlotData.type}`)
    })

    describe('when making InSlots', () => {

      const classToSeederMap = {
        [IntegerInSlot.DATA_TYPE]: IntegerInSlotSeeder,
        [FloatInSlot.DATA_TYPE]: FloatInSlotSeeder,
        [BooleanInSlot.DATA_TYPE]: BooleanInSlotSeeder,
        [OneOfInSlot.DATA_TYPE]: OneOfInSlotSeeder,
      }

      const supportedDataTypesWithSeeder = SlotFactory.SUPPORTED_IN_SLOT_CLASSES
        .map(SlotClass => ({
          dataType: SlotClass.DATA_TYPE,
          SeederClass: classToSeederMap[SlotClass.DATA_TYPE],
        }))

      supportedDataTypesWithSeeder.forEach(({ dataType, SeederClass }) => {
        describe(`of dataType: ${dataType}`, () => {
          const inSlotData = SeederClass.generate()
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
