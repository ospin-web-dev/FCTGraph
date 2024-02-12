const { faker } = require('@faker-js/faker')
const DataStream = require('dataStreams/DataStream')

describe('DataStream', () => {
  describe('create', () => {
    it('sets the default values accordingly', () => {
      const data = {
        id: faker.string.uuid(),
        sourceFctId: faker.string.uuid(),
        sourceSlotName: faker.lorem.word(),
        sinkFctId: faker.string.uuid(),
        sinkSlotName: faker.lorem.word(),
      }

      const dataStream = DataStream.create(data)

      expect(dataStream.averagingWindowSize).toBe(0)
    })
  })
})
