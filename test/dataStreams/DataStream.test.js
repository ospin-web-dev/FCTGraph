const DataStream = require('dataStreams/DataStream')
const DataStreamSeeder = require('seeders/dataStreams/DataStreamSeeder')
const {
  FloatInSlotSeeder,
  FloatOutSlotSeeder,
} = require('seeders/slots')

describe('the DataStream class', () => {

  describe('.constructor', () => {
    it('sets averagingWindowSize to 0 by default', () => {
      const dataStreamData = DataStreamSeeder.generate()
      delete dataStreamData.averagingWindowSize

      const dataStream = new DataStream(dataStreamData)

      expect(dataStream.averagingWindowSize).toBe(0)
    })
  })

  describe('.isConnectionBetweenTwoSlots', () => {
    it('returns false if the first slot is neither a source nor a sink', () => {
      const slotA = FloatOutSlotSeeder.seedCelsiusOut()
      const slotB = FloatInSlotSeeder.seedCelsiusIn()

      const dataStream = DataStreamSeeder.seedOne()

      expect(dataStream.isConnectionBetweenTwoSlots(slotA, slotB)).toBe(false)
    })
  })
})
