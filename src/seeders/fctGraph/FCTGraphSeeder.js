const FCTGraph = require('../../fctGraph/FCTGraph')
const RandomDataGenerator = require('../../utils/RandomDataGenerator')

const generate = (data = {}) => (
  FCTGraph.create({
    id: RandomDataGenerator.uuid(),
    deviceId: RandomDataGenerator.uuid(),
    name: RandomDataGenerator.jobDescriptor(),
    ...data,
  })
)

module.exports = { generate }
