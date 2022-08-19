const faker = require('faker')
const DataStream = require('dataStreams/DataStream')

describe('DataStream', () => {
  describe('create', () => {
    it('sets the default values accordingly', () => {
      const data = {
        id: faker.datatype.uuid(),
        sourceFctId: faker.datatype.uuid(),
        sourceSlotName: faker.random.word(),
        sinkFctId: faker.datatype.uuid(),
        sinkSlotName: faker.random.word(),
      }

      const dataStream = DataStream.create(data)

      expect(dataStream.averagingWindowSize).toBe(0)
    })
  })
})
