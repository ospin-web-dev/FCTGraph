const compose = require('@choux/compose')

const FCTGraph = require('../../fctGraph/FCTGraph')
const FactorySeeder = require('../FactorySeeder')
const {
  TemperatureSensorSeeder,
  HeaterActuatorSeeder,
  PIDControllerSeeder,
  IntervalOutSeeder,
  PushOutSeeder,
} = require('../functionalities')
const RandomDataGenerator = require('../../utils/RandomDataGenerator')

class FCTGraphSeeder {

  static get SEED_METHOD() { return (...data) => new FCTGraph(...data) }

  static get FCT_SEEDS() {
    return [
      TemperatureSensorSeeder.generate(),
      HeaterActuatorSeeder.generate(),
      PIDControllerSeeder.generate(),
      IntervalOutSeeder.generate(),
      PushOutSeeder.generate(),
    ]
  }

  static get FCT_SEED_SUB_TYPES() {
    return this.FCT_SEEDS.map(({ subType }) => subType)
  }

  static generate(data) {
    return {
      id: RandomDataGenerator.uuid(),
      deviceId: RandomDataGenerator.uuid(),
      name: RandomDataGenerator.jobDescriptor(),
      deviceDefault: RandomDataGenerator.boolean(),
      functionalities: [ ...this.FCT_SEEDS ],
      ...data,
    }
  }

}

module.exports = compose([ FactorySeeder ])(FCTGraphSeeder)
