const DataStream = require('dataStreams/DataStream')
const DataStreamSeeder = require('seeders/dataStreams/DataStreamSeeder')

describe('the DataStream class', () => {

  describe('.constructor', () => {
    it('sets averagingWindowSize to 0 by default', () => {
      const dataStreamData = DataStreamSeeder.generate()
      delete dataStreamData.averagingWindowSize

      const dataStream = new DataStream(dataStreamData)

      expect(dataStream.averagingWindowSize).toBe(0)
    })
  })
})
