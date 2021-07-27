const { v4: uuidv4 } = require('uuid')
const faker = require('faker')

const Slot = require('slots/Slot')
const SlotFactory = require('slots/factories/SlotFactory')
const InSlot = require('slots/InSlot')
const FloatInSlot = require('slots/FloatInSlot')
const IntegerInSlot = require('slots/IntegerInSlot')
const OutSlot = require('slots/OutSlot')
const DataStream = require('dataStreams/DataStream')
const DataStreamSeeder = require('seeders/dataStreams/DataStreamSeeder')
const {
  FloatInSlotSeeder,
  FloatOutSlotSeeder,
  IntegerOutSlotSeeder,
  RandomSlotSeeder,
} = require('seeders/slots')
/* the SlotSeeder is not present in the seeders/slots index because it
 * should not be exposed as public seeder interface */
const SlotSeeder = require('seeders/slots/SlotSeeder')

describe('the Slot class', () => {

  describe('static get .SUPPORTS_CALIBRATION', () => {
    it('returns false for InSlot', () => { expect(InSlot.SUPPORTS_CALIBRATION).toBe(false) })

    it('returns true for OutSlot', () => { expect(OutSlot.SUPPORTS_CALIBRATION).toBe(true) })
  })

  describe('static get .SUPPORTED_CALIBRATION_TYPES', () => {
    it('returns OFFSET_SLOPE for OutSlots', () => {
      expect(OutSlot.SUPPORTED_CALIBRATION_TYPES)
        .toStrictEqual([ OutSlot.OFFSET_SLOPE_CALIBRATON_TYPE ])
    })
  })

  describe('.constructor', () => {
    it('converts dataStream data in to DataStream instances', () => {
      const outSlot = RandomSlotSeeder.generate()
      const dataStream = DataStreamSeeder.generate({ sourceSlotName: outSlot.name })

      outSlot.dataStreams.push(dataStream)

      const slotInstance = SlotFactory.new(outSlot)

      expect(slotInstance.dataStreams).toHaveLength(1)
      expect(slotInstance.dataStreams[0].constructor.name)
        .toStrictEqual('DataStream')
    })
  })

  describe('.serialize', () => {
    it('converts dataStreams back to nested objects', () => {
      const dataStreamData = DataStreamSeeder.generate()

      const outSlotData = RandomSlotSeeder.generate()

      const dataStreamPopulated = {
        ...dataStreamData,
        sourceSlotName: outSlotData.name,
        sourceFctId: faker.datatype.uuid(),
      }
      outSlotData.dataStreams = [ dataStreamPopulated ]

      const outSlot = new OutSlot(outSlotData)

      expect(outSlot.serialize().dataStreams[0]).toStrictEqual(dataStreamPopulated)
    })
  })

  describe('.assertStructure', () => {

    it('blows up because Slot is a virtual class and it wants to kindly tell you that a mistake was likely made in a child that has not defined the method', () => {
      const slot = new Slot(SlotSeeder.generate())

      expect(() => {
        slot.assertStructure()
      }).toThrow(/requires an \.assertStructure method/)
    })
  })

  describe('.addConnectionTo', () => {

    it('adds the same dataStream instance to both slots', () => {
      const slotA = FloatOutSlotSeeder.seedCelciusOut()
      const slotB = FloatInSlotSeeder.seedCelciusIn()

      FloatOutSlotSeeder.stubOwningFct(slotA)
      FloatInSlotSeeder.stubOwningFct(slotB)

      const dataStreamOpts = { averagingWindowSize: 10 }
      const {
        error,
        errorMsg,
        thisSlot,
        otherSlot,
      } = slotA.addConnectionTo(slotB, dataStreamOpts)

      expect(error).toBe(false)
      expect(errorMsg).toBeNull()
      expect(thisSlot.dataStreams).toStrictEqual(otherSlot.dataStreams)
      expect(thisSlot.dataStreams[0].averagingWindowSize).toBe(dataStreamOpts.averagingWindowSize)
    })

    it('adds the same dataStream instance to both slots regardless of which is calling addConnectionTo on the other', () => {
      const slotA = FloatOutSlotSeeder.seedCelciusOut()
      const slotB = FloatInSlotSeeder.seedCelciusIn()

      FloatOutSlotSeeder.stubOwningFct(slotA)
      FloatInSlotSeeder.stubOwningFct(slotB)

      const { error, errorMsg, thisSlot, otherSlot } = slotB.addConnectionTo(slotA)

      expect(error).toBe(false)
      expect(errorMsg).toBeNull()
      expect(thisSlot.dataStreams).toStrictEqual(otherSlot.dataStreams)
    })

    it('returns an error response when the slot dataTypes are incompatible', () => {
      const slotA = IntegerOutSlotSeeder.seedCelciusOut()
      const slotB = FloatInSlotSeeder.seedCelciusIn()

      const { error, errorMsg } = slotA.addConnectionTo(slotB)

      expect(error).toBe(true)
      expect(errorMsg).toContain('dataTypes must match between slots')
    })

    it('returns an error when the slot types are incompatible', () => {
      const slotA = FloatOutSlotSeeder.seedCelciusOut()
      const slotB = FloatInSlotSeeder.seedCelciusIn()
      slotA.type = OutSlot.TYPE
      slotB.type = OutSlot.TYPE

      const {
        error: outToOutError,
        errorMsg: outToOutErrorMsg,
      } = slotA.addConnectionTo(slotB)

      expect(outToOutError).toBe(true)
      expect(outToOutErrorMsg).toContain('must have complimentary types')

      slotA.type = InSlot.TYPE
      slotB.type = InSlot.TYPE

      const {
        error: inToInError,
        errorMsg: inToInErrorMsgm,
      } = slotA.addConnectionTo(slotB)

      expect(inToInError).toBe(true)
      expect(inToInErrorMsgm).toContain('must have complimentary types')
    })

    it('returns an error when the slot units are incompatible', () => {
      const slotA = FloatOutSlotSeeder.seedCelciusOut()
      const slotB = FloatInSlotSeeder.seedKelvinIn()

      const { error, errorMsg } = slotA.addConnectionTo(slotB)

      expect(error).toBe(true)
      expect(errorMsg).toContain('units must match between slots')
    })

    it('the dataStream gets removed from the slots if either fails validation after the dataStream is added', () => {
      const slotA = FloatOutSlotSeeder.seedCelciusOut()
      const slotB = FloatInSlotSeeder.seedCelciusIn()

      FloatOutSlotSeeder.stubOwningFct(slotA)
      FloatInSlotSeeder.stubOwningFct(slotB)

      const slotAPreLength = slotA.dataStreams.length
      const slotBPreLength = slotB.dataStreams.length

      const slotAPushSpy = jest.spyOn(slotA.dataStreams, 'push').mockImplementation(el => {
        slotA.dataStreams = [ ...slotA.dataStreams, el ]
        slotA.name = 12345
      })
      slotA.addConnectionTo(slotB)

      slotAPushSpy.mockRestore()
      expect(slotA.dataStreams).toHaveLength(slotAPreLength)
      expect(slotB.dataStreams).toHaveLength(slotBPreLength)
    })

    it('unrelated dataStreams dont get removed from the slots if the first slot somehow impossibly goofs up and doesnt add the data stream but also doesn\'t blow up while the second one does add it and blows up (this test is superfluous and just to get that sweet sweet 100% coverage)', () => {
      const existingDataStream = new DataStream({
        id: uuidv4(),
        sourceFctId: uuidv4(),
        sourceSlotName: 'this can not exist',
        sinkFctId: uuidv4(),
        sinkSlotName: 'under normal circumstances',
      })

      const slotA = FloatOutSlotSeeder.seedCelciusOut()
      const slotB = FloatInSlotSeeder.seedCelciusIn()

      FloatOutSlotSeeder.stubOwningFct(slotA)
      FloatInSlotSeeder.stubOwningFct(slotB)

      slotA.dataStreams = [ existingDataStream ]
      slotB.dataStreams = [ existingDataStream ]

      const slotAPreLength = slotA.dataStreams.length
      const slotBPreLength = slotB.dataStreams.length

      const slotAPushSpy = jest.spyOn(slotA.dataStreams, 'push').mockImplementation(() => {
        slotA.dataStreams = [ ...slotA.dataStreams ]
      })

      const slotBPushSpy = jest.spyOn(slotB.dataStreams, 'push').mockImplementation(el => {
        slotB.dataStreams = [ ...slotB.dataStreams, el ]
        slotB.name = 12345
      })
      slotA.addConnectionTo(slotB)

      slotBPushSpy.mockRestore()
      slotAPushSpy.mockRestore()
      expect(slotA.dataStreams).toHaveLength(slotAPreLength)
      expect(slotB.dataStreams).toHaveLength(slotBPreLength)
    })

    it('unrelated dataStreams dont get removed from the slots if the second slot fails validation when the dataStream is being added', () => {
      const existingDataStream = new DataStream({
        id: uuidv4(),
        sourceFctId: uuidv4(),
        sourceSlotName: 'this can not exist',
        sinkFctId: uuidv4(),
        sinkSlotName: 'under normal circumstances',
      })

      const slotA = FloatOutSlotSeeder.seedCelciusOut()
      const slotB = FloatInSlotSeeder.seedCelciusIn()

      FloatOutSlotSeeder.stubOwningFct(slotA)
      FloatInSlotSeeder.stubOwningFct(slotB)

      slotA.dataStreams = [ existingDataStream ]
      slotB.dataStreams = [ existingDataStream ]

      const slotAPreLength = slotA.dataStreams.length
      const slotBPreLength = slotB.dataStreams.length

      const slotAPushSpy = jest.spyOn(slotA.dataStreams, 'push').mockImplementation(el => {
        slotA.dataStreams = [ ...slotA.dataStreams, el ]
        slotA.name = 12345
      })
      slotB.addConnectionTo(slotA)

      slotAPushSpy.mockRestore()
      expect(slotA.dataStreams).toHaveLength(slotAPreLength)
      expect(slotB.dataStreams).toHaveLength(slotBPreLength)
    })
  })

  describe('.filterConnectableSlots', () => {
    it('throws error if the connection possibility validation fails for an unkown reason', () => {
      const slotA = FloatOutSlotSeeder.seedCelciusOut()
      const slotB = FloatInSlotSeeder.seedCelciusIn()
      const unknownErrorMsg = 'UNKNOWN!'

      const slotAPushSpy = jest.spyOn(slotA, '_assertConnectionBetweenIsPossible').mockImplementation(() => {
        throw new Error(unknownErrorMsg)
      })

      expect(() => {
        slotA.filterConnectableSlots([ slotB ])
      }).toThrow(unknownErrorMsg)

      slotAPushSpy.mockRestore()
    })
  })

  describe('.isUnitless', () => {
    it('returns true and false dependent on the slots unit', () => {
      const withUnitSlot = FloatInSlotSeeder.seedCelciusIn()
      const withoutUnitSlot = FloatOutSlotSeeder.seedCelciusOut()
      withoutUnitSlot.unit = Slot.UNITLESS_UNIT

      expect(withUnitSlot.isUnitless()).toBe(false)
      expect(withoutUnitSlot.isUnitless()).toBe(true)
    })
  })
})
