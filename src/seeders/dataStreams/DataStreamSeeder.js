const DataStream = require('../../dataStreams/DataStream')
const RandomDataGenerator = require('../../utils/RandomDataGenerator')

const generate = (data = {}) => (
  DataStream.create({
    id: RandomDataGenerator.uuid(),
    sourceFctId: RandomDataGenerator.uuid(),
    sinkFctId: RandomDataGenerator.uuid(),
    sourceSlotName: RandomDataGenerator.frog(),
    sinkSlotName: RandomDataGenerator.frog(),
    averagingWindowSize: RandomDataGenerator.integer({
      min: 0, max: 1000000,
    }),
    ...data,
  })
)

module.exports = { generate }
