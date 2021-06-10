const { v4: uuidv4 } = require('uuid')

const Slot = require('slots/Slot')
const InSlot = require('slots/InSlot')
const OutSlot = require('slots/OutSlot')
const DataStream = require('dataStreams/DataStream')
const { InSlotSeeder, OutSlotSeeder } = require('test/seeders/slots')

describe('the Slot class', () => {

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
      // this test requires the test above for full coverage
      const slotA = OutSlotSeeder.seedCelciusOut()
      const slotB = InSlotSeeder.seedCelciusIn()

      const { error, errorMsg, thisSlot, otherSlot } = slotB.addConnectionTo(slotA)

      expect(error).toBe(false)
      expect(errorMsg).toBeNull()
      expect(thisSlot.dataStreams).toStrictEqual(otherSlot.dataStreams)
      expect(thisSlot.dataStreams[0].averagingWindowSize).toBeUndefined()
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
      const slotB = InSlotSeeder.seedCelciusIn()
      const [ percentUnit ] = Slot.UNIT_TYPE_UNIT_OPTIONS.percentage
      slotB.unit = percentUnit

      const { error, errorMsg } = slotA.addConnectionTo(slotB)

      expect(error).toBe(true)
      expect(errorMsg).toContain('units must match between slots')
    })

    it('the dataStream gets removed from the slots if either fails validation after the dataStream is added', () => {
      const slotA = OutSlotSeeder.seedCelciusOut()
      const slotB = InSlotSeeder.seedCelciusIn()
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
        sourceSlotName: 'this can not exist',
        sinkSlotName: 'under normal circumstances',
      })

      const slotA = OutSlotSeeder.seedCelciusOut()
      const slotB = InSlotSeeder.seedCelciusIn()
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
        sourceSlotName: 'this can not exist',
        sinkSlotName: 'under normal circumstances',
      })

      const slotA = OutSlotSeeder.seedCelciusOut()
      const slotB = InSlotSeeder.seedCelciusIn()
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
