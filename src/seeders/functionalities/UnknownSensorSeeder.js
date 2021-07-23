const SensorSeeder = require('./SensorSeeder')
const { RandomSlotSeeder } = require('../slots')
const UnknownSensor = require('../../functionalities/UnknownSensor')

class UnknownSensorSeeder extends SensorSeeder {

  static generateSlots() {
    return [
      RandomSlotSeeder.generateRandomOutSlot({ name: 'value out' }),
    ]
  }

  static generate(overrideData = {}) {
    return {
      ...super.generate(overrideData),
      subType: UnknownSensor.SUB_TYPE,
      slots: this.generateSlots(),
      ...overrideData,
    }
  }

}

module.exports = UnknownSensorSeeder
