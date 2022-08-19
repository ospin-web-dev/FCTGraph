const RandomDataGenerator = require('../../utils/RandomDataGenerator')
const Functionality = require('../../functionalities/Functionality')

const generate = (data = {}) => (
  Functionality.create({
    id: RandomDataGenerator.uuid(),
    type: `${RandomDataGenerator.frog()} Type`,
    subType: `${RandomDataGenerator.frog()} SubType`,
    name: RandomDataGenerator.hackerNoun(),
    isVirtual: RandomDataGenerator.boolean(),
    firmwareBlackBox: {},
    ...data,
  })
)

const generatePushIn = (data = {}) => (
  Functionality.createPushIn(data)
)

const generateIntervalOut = (data = {}) => (
  Functionality.createIntervalOut(data)
)

const generateActuator = (data = {}) => (
  generate({
    type: 'Actuator',
    subType: `${RandomDataGenerator.frog()} SubType`,
    slots: [],
    isVirtual: false,
    ...data,
  })
)

const generateSensor = (data = {}) => (
  generate({
    type: 'Sensor',
    subType: `${RandomDataGenerator.frog()} SubType`,
    slots: [],
    isVirtual: false,
    ...data,
  })
)

const generateController = (data = {}) => (
  generate({
    type: 'Controller',
    subType: `${RandomDataGenerator.frog()} SubType`,
    slots: [],
    isVirtual: true,
    ...data,
  })
)

module.exports = {
  generate,
  generatePushIn,
  generateIntervalOut,
  generateActuator,
  generateSensor,
  generateController,
}
