const SlotFactory = require('slots/factories/SlotFactory')
const InSlot = require('slots/InSlot')

const {
  OneOfInSlot,
  BooleanInSlot,
  IntegerInSlot,
  FloatInSlot,

  OneOfOutSlot,
  BooleanOutSlot,
  IntegerOutSlot,
  FloatOutSlot,
} = require('slots')

const {
  BooleanInSlotSeeder,
  FloatInSlotSeeder,
  IntegerInSlotSeeder,
  OneOfInSlotSeeder,

  BooleanOutSlotSeeder,
  FloatOutSlotSeeder,
  IntegerOutSlotSeeder,
  OneOfOutSlotSeeder,
} = require('seeders/slots')
const OutSlotSeeder = require('seeders/slots/OutSlotSeeder')

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

      const dataTypeToSeederMap = {
        [IntegerInSlot.DATA_TYPE]: IntegerInSlotSeeder,
        [FloatInSlot.DATA_TYPE]: FloatInSlotSeeder,
        [BooleanInSlot.DATA_TYPE]: BooleanInSlotSeeder,
        [OneOfInSlot.DATA_TYPE]: OneOfInSlotSeeder,
      }

      /* this provides us with an object that has the (expected) associated
       * dataType, SeederClass, and SlotClass. The test should be extensible
       * by simply updating the above array with any new slots pointing
       * to their seeder
       */
      const expectedUnions = SlotFactory.SUPPORTED_IN_SLOT_CLASSES
        .map(SlotClass => ({
          dataType: SlotClass.DATA_TYPE,
          SeederClass: dataTypeToSeederMap[SlotClass.DATA_TYPE],
          SlotClass,
        }))

      expectedUnions.forEach(({ dataType, SeederClass, SlotClass }) => {
        describe(`of dataType: ${dataType}`, () => {
          const inSlotData = SeederClass.generate()
          const inSlot = SlotFactory.new(inSlotData)

          it('creates the correct slot type...', () => {
            expect(inSlot instanceof SlotClass).toBe(true)
          })

          it('...which serializes back to its original data object', () => {
            // eslint-disable-next-line jest/prefer-strict-equal
            expect(inSlot.serialize()).toEqual(inSlotData)
          })
        })
      })
    })

    describe('when making OutSlots', () => {
      const dataTypeToSeederMap = {
        [IntegerOutSlot.DATA_TYPE]: IntegerOutSlotSeeder,
        [FloatOutSlot.DATA_TYPE]: FloatOutSlotSeeder,
        [BooleanOutSlot.DATA_TYPE]: BooleanOutSlotSeeder,
        [OneOfOutSlot.DATA_TYPE]: OneOfOutSlotSeeder,
      }

      /* this provides us with an object that has the (expected) associated
       * dataType, SeederClass, and SlotClass. The test should be extensible
       * by simply updating the above array with any new slots pointing
       * to their seeder
       */
      const expectedUnions = SlotFactory.SUPPORTED_OUT_SLOT_CLASSES
        .map(SlotClass => ({
          dataType: SlotClass.DATA_TYPE,
          SeederClass: dataTypeToSeederMap[SlotClass.DATA_TYPE],
          SlotClass,
        }))

      expectedUnions.forEach(({ dataType, SeederClass, SlotClass }) => {
        describe(`of dataType: ${dataType}`, () => {
          const outSlotData = SeederClass.generate()
          const outSlot = SlotFactory.new(outSlotData)

          it('creates the correct slot type...', () => {
            expect(outSlot instanceof SlotClass).toBe(true)
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
