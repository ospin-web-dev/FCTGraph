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
    it('by default assigns an empty array to dataStreams', () => {
      const outSlot = RandomSlotSeeder.generate()
      SlotSeeder.stubOwningFct(outSlot)

      const slotInstance = SlotFactory.new(outSlot)

      expect(slotInstance.dataStreams).toStrictEqual([])
    })
  })

  describe('.serialize', () => {
    it('converts dataStreams back to nested objects', () => {
      const slotA = FloatOutSlotSeeder.seedCelsiusOut()
      const slotB = FloatInSlotSeeder.seedCelsiusIn()

      SlotSeeder.stubOwningFct(slotA)
      SlotSeeder.stubOwningFct(slotB)

      slotA.connectTo(slotB)

      expect(slotA.serialize().dataStreams[0]).toStrictEqual({
        ...slotA.dataStreams[0].serialize(),
      })
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

  describe('get .connectedSlots', () => {

    it('blows up if one of the slots dataStreams cant find the slot as either the source or the sink', () => {
      const slot = RandomSlotSeeder.seedOne()
      SlotSeeder.stubOwningFct(slot)
      const abominationDataStream = DataStreamSeeder.seedOne()

      slot._addDataStream(abominationDataStream)

      expect(() => {
        slot.connectedSlots // eslint-disable-line
      }).toThrow(/neither source nor sink matching/)
    })
  })

  describe('isConnectedToSlot', () => {

    it('returns true if connected', () => {
      const slotA = FloatOutSlotSeeder.seedCelsiusOut()
      const slotB = FloatInSlotSeeder.seedCelsiusIn()
      const slotC = RandomSlotSeeder.seedOne()

      SlotSeeder.stubOwningFct(slotA)
      SlotSeeder.stubOwningFct(slotB)

      slotA.connectTo(slotB)

      expect(slotA.isConnectedToSlot(slotB)).toBe(true)
    })

    it('returns false if not connected', () => {
      const slotA = FloatOutSlotSeeder.seedCelsiusOut()
      const slotB = FloatInSlotSeeder.seedCelsiusIn()
      const slotC = RandomSlotSeeder.seedOne()

      SlotSeeder.stubOwningFct(slotA)
      SlotSeeder.stubOwningFct(slotB)

      slotA.connectTo(slotB)

      expect(slotA.isConnectedToSlot(slotC)).toBe(false)
    })
  })

  describe('_assertHasRoomForConnectionTo', () => {
    it('blows up because Slot is a virtual class and it wants to kindly tell you that a mistake was likely made in a child that has not defined the method', () => {
      const slot = new Slot(SlotSeeder.generate())

      expect(() => {
        slot._assertHasRoomForConnectionTo()
      }).toThrow(/requires an \._assertHasRoomForConnectionTo method/)
    })
  })

  describe('.connectTo', () => {

    it('adds the same dataStream instance to both slots', () => {
      const slotA = FloatOutSlotSeeder.seedCelsiusOut()
      const slotB = FloatInSlotSeeder.seedCelsiusIn()

      FloatOutSlotSeeder.stubOwningFct(slotA)
      FloatInSlotSeeder.stubOwningFct(slotB)

      const dataStreamOpts = { averagingWindowSize: 10 }
      const {
        error,
        errorMsg,
        thisSlot,
        otherSlot,
      } = slotA.connectTo(slotB, dataStreamOpts)

      expect(error).toBe(false)
      expect(errorMsg).toBeNull()
      expect(thisSlot.dataStreams).toStrictEqual(otherSlot.dataStreams)
      expect(thisSlot.dataStreams[0].averagingWindowSize).toBe(dataStreamOpts.averagingWindowSize)
    })

    it('adds the same dataStream instance to both slots regardless of which is calling connectTo on the other', () => {
      const slotA = FloatOutSlotSeeder.seedCelsiusOut()
      const slotB = FloatInSlotSeeder.seedCelsiusIn()

      FloatOutSlotSeeder.stubOwningFct(slotA)
      FloatInSlotSeeder.stubOwningFct(slotB)

      const { error, errorMsg, thisSlot, otherSlot } = slotB.connectTo(slotA)

      expect(error).toBe(false)
      expect(errorMsg).toBeNull()
      expect(thisSlot.dataStreams).toStrictEqual(otherSlot.dataStreams)
    })

    it('returns an error response when the slot dataTypes are incompatible', () => {
      const slotA = IntegerOutSlotSeeder.seedCelsiusOut()
      const slotB = FloatInSlotSeeder.seedCelsiusIn()

      const { error, errorMsg } = slotA.connectTo(slotB)

      expect(error).toBe(true)
      expect(errorMsg).toContain('dataTypes must match between slots')
    })

    it('returns an error when the slot types are incompatible', () => {
      const slotA = FloatOutSlotSeeder.seedCelsiusOut()
      const slotB = FloatInSlotSeeder.seedCelsiusIn()
      slotA.type = OutSlot.TYPE
      slotB.type = OutSlot.TYPE

      const {
        error: outToOutError,
        errorMsg: outToOutErrorMsg,
      } = slotA.connectTo(slotB)

      expect(outToOutError).toBe(true)
      expect(outToOutErrorMsg).toContain('must have complimentary types')

      slotA.type = InSlot.TYPE
      slotB.type = InSlot.TYPE

      const {
        error: inToInError,
        errorMsg: inToInErrorMsgm,
      } = slotA.connectTo(slotB)

      expect(inToInError).toBe(true)
      expect(inToInErrorMsgm).toContain('must have complimentary types')
    })

    it('returns an error when the slot units are incompatible', () => {
      const slotA = FloatOutSlotSeeder.seedCelsiusOut()
      const slotB = FloatInSlotSeeder.seedKelvinIn()

      const { error, errorMsg } = slotA.connectTo(slotB)

      expect(error).toBe(true)
      expect(errorMsg).toContain('units must match between slots')
    })

    it('returns an error when the slots already have a connection between them', () => {
      const slotA = FloatOutSlotSeeder.seedCelsiusOut()
      const slotB = FloatInSlotSeeder.seedCelsiusIn()

      FloatOutSlotSeeder.stubOwningFct(slotA)
      FloatInSlotSeeder.stubOwningFct(slotB)

      slotA.connectTo(slotB)

      const { error: errorAToB, errorMsg: errorMsgAToB } = slotA.connectTo(slotB)
      expect(errorAToB).toBe(true)
      expect(errorMsgAToB).toContain('already connected to target slot')

      const { error: errorBToA, errorMsg: errorMsgBToA } = slotB.connectTo(slotA)
      expect(errorBToA).toBe(true)
      expect(errorMsgBToA).toContain('already connected to target slot')
    })

    it('returns an error when the outslot already has a dataStream', () => {
      const outSlotA = FloatOutSlotSeeder.seedCelsiusOut()
      const outSlotB = FloatOutSlotSeeder.seedCelsiusOut()
      const slotIn = FloatInSlotSeeder.seedCelsiusIn()

      FloatOutSlotSeeder.stubOwningFct(outSlotA)
      FloatOutSlotSeeder.stubOwningFct(outSlotB)
      FloatOutSlotSeeder.stubOwningFct(slotIn)

      outSlotA.connectTo(slotIn)

      const { error, errorMsg } = outSlotB.connectTo(slotIn)
      expect(error).toBe(true)
      expect(errorMsg).toContain('can only have a single dataStream')
    })
  })

  describe('.filterConnectableSlots', () => {
    it('throws error if the connection possibility validation fails for an unknown reason', () => {
      const slotA = FloatOutSlotSeeder.seedCelsiusOut()
      const slotB = FloatInSlotSeeder.seedCelsiusIn()
      const unknownErrorMsg = 'UNKNOWN!'

      const slotAPushSpy = jest.spyOn(Slot, '_assertConnectionBetweenIsPossible').mockImplementation(() => {
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
      const withUnitSlot = FloatInSlotSeeder.seedCelsiusIn()
      const withoutUnitSlot = FloatOutSlotSeeder.seedCelsiusOut()
      withoutUnitSlot.unit = Slot.UNITLESS_UNIT

      expect(withUnitSlot.isUnitless()).toBe(false)
      expect(withoutUnitSlot.isUnitless()).toBe(true)
    })
  })

  describe('.getAllDataStreamsToManySlots', () => {
    it('returns all dataStreams that connect to the array of slots provided', () => {
      const slotA = FloatOutSlotSeeder.seedCelsiusOut()
      const slotB = FloatInSlotSeeder.seedCelsiusIn()
      const slotC = FloatInSlotSeeder.seedCelsiusIn()

      FloatOutSlotSeeder.stubOwningFct(slotA)
      FloatInSlotSeeder.stubOwningFct(slotB)
      FloatInSlotSeeder.stubOwningFct(slotC)

      slotA.connectTo(slotB)

      const connectingDataStreams = slotA.getAllDataStreamsToManySlots([ slotB, slotC ])

      expect(connectingDataStreams).toHaveLength(1)
      const [ dataStream ] = connectingDataStreams
      expect(dataStream.sourceSlot).toBe(slotA)
      expect(dataStream.sinkSlot).toBe(slotB)
    })
  })

  describe('.disconnectFrom', () => {
    it('removes the same dataStream instance from both slots', () => {
      const slotA = FloatOutSlotSeeder.seedCelsiusOut()
      const slotB = FloatInSlotSeeder.seedCelsiusIn()

      FloatOutSlotSeeder.stubOwningFct(slotA)
      FloatInSlotSeeder.stubOwningFct(slotB)

      slotA.connectTo(slotB)
      expect(slotA.isConnectedToSlot(slotB)).toBe(true)

      slotA.disconnectFrom(slotB)
      expect(slotA.isConnectedToSlot(slotB)).toBe(false)
      expect(slotA.dataStreams).toHaveLength(0)
      expect(slotB.dataStreams).toHaveLength(0)
    })

  })
})
