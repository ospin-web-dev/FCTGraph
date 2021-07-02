const { v4: uuidv4 } = require('uuid')
const faker = require('faker')

const Slot = require('slots/Slot')
const InSlot = require('slots/InSlot')
const OutSlot = require('slots/OutSlot')
const DataStream = require('dataStreams/DataStream')
const DataStreamSeeder = require('seeders/dataStreams/DataStreamSeeder')
const { InSlotSeeder, OutSlotSeeder } = require('seeders/slots')
/* the SlotSeeder is not present in the seeders/slots index because it
 * should not be exposed as public seeder interface */
const SlotSeeder = require('seeders/slots/SlotSeeder')

describe('the Slot class', () => {

  // TODO: consider new test files for the following two tests, as they are In/Outslot specific
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
    describe('on InSlots', () => {
      it('sets tareable to false by default', () => {
        const slotData = InSlotSeeder.generate()
        delete slotData.tareable

        const slot = new InSlot(slotData)

        expect(slot.tareable).toBe(false)
      })

      it('sets defaultValue to null by default', () => {
        const slotData = InSlotSeeder.generate()
        delete slotData.defaultValue

        const slot = new InSlot(slotData)

        expect(slot.defaultValue).toBeNull()
      })
    })

    it('allows null for displayType', () => {
      const slotData = SlotSeeder.generate({ displayType: null })
      const slot = new Slot(slotData)

      expect(slot.displayType).toBeNull()
    })

    it('converts dataStream data in to DataStream instances', () => {
      const outSlot = OutSlotSeeder.seedWithDataStream()

      expect(outSlot.dataStreams).toHaveLength(1)
      expect(outSlot.dataStreams[0].constructor.name)
        .toStrictEqual('DataStream')
    })
  })

  describe('.serialize', () => {
    it('converts dataStreams back to nested objects', () => {
      const dataStreamData = DataStreamSeeder.generate()

      const outSlotData = OutSlotSeeder.generate()

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
      const slot = new Slot(InSlotSeeder.generate())

      expect(() => {
        slot.assertStructure()
      }).toThrow(/requires an \.assertStructure method/)
    })
  })

  describe('.addConnectionTo', () => {

    it('adds the same dataStream instance to both slots', () => {
      const slotA = OutSlotSeeder.seedCelciusOut()
      const slotB = InSlotSeeder.seedCelciusIn()

      OutSlotSeeder.stubOwningFct(slotA)
      InSlotSeeder.stubOwningFct(slotB)

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
      const slotA = OutSlotSeeder.seedCelciusOut()
      const slotB = InSlotSeeder.seedCelciusIn()

      OutSlotSeeder.stubOwningFct(slotA)
      InSlotSeeder.stubOwningFct(slotB)

      const { error, errorMsg, thisSlot, otherSlot } = slotB.addConnectionTo(slotA)

      expect(error).toBe(false)
      expect(errorMsg).toBeNull()
      expect(thisSlot.dataStreams).toStrictEqual(otherSlot.dataStreams)
    })

    it('returns an error response when the slot dataTypes are incompatible', () => {
      const slotA = OutSlotSeeder.seedCelciusOut({ dataType: OutSlot.DATA_TYPES.FLOAT })
      const slotB = InSlotSeeder.seedCelciusIn({ dataType: InSlot.DATA_TYPES.INTEGER })

      const { error, errorMsg } = slotA.addConnectionTo(slotB)

      expect(error).toBe(true)
      expect(errorMsg).toContain('dataTypes must match between slots')
    })

    it('returns an error when the slot types are incompatible', () => {
      const slotA = OutSlotSeeder.seedCelciusOut()
      const slotB = InSlotSeeder.seedCelciusIn()
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
      const slotA = OutSlotSeeder.seedCelciusOut()
      const slotB = InSlotSeeder.seedKelvinIn()

      const { error, errorMsg } = slotA.addConnectionTo(slotB)

      expect(error).toBe(true)
      expect(errorMsg).toContain('units must match between slots')
    })

    it('the dataStream gets removed from the slots if either fails validation after the dataStream is added', () => {
      const slotA = OutSlotSeeder.seedCelciusOut()
      const slotB = InSlotSeeder.seedCelciusIn()

      OutSlotSeeder.stubOwningFct(slotA)
      InSlotSeeder.stubOwningFct(slotB)

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

      const slotA = OutSlotSeeder.seedCelciusOut()
      const slotB = InSlotSeeder.seedCelciusIn()

      OutSlotSeeder.stubOwningFct(slotA)
      InSlotSeeder.stubOwningFct(slotB)

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

      const slotA = OutSlotSeeder.seedCelciusOut()
      const slotB = InSlotSeeder.seedCelciusIn()

      OutSlotSeeder.stubOwningFct(slotA)
      InSlotSeeder.stubOwningFct(slotB)

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
      const slotA = OutSlotSeeder.seedCelciusOut()
      const slotB = InSlotSeeder.seedCelciusIn()
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
})
