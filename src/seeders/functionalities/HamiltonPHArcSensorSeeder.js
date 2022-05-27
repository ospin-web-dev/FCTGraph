const SensorSeeder = require('./SensorSeeder')
const { FloatOutSlotSeeder } = require('../slots')
const HamiltonPHArcSensor = require('../../functionalities/HamiltonPHArcSensor')

class HamiltonPHArcSensorSeeder extends SensorSeeder {

  static generateSlots() {
    return [
      FloatOutSlotSeeder.generate({ name: 'value out', unit: '-' }),
    ]
  }

  static generate(overrideData = {}) {
    return {
      ...super.generate(overrideData),
      subType: HamiltonPHArcSensor.SUB_TYPE,
      slots: this.generateSlots(),
      ...overrideData,
    }
  }

}

module.exports = HamiltonPHArcSensorSeeder
