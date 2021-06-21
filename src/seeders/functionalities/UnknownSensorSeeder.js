const SensorSeeder = require('./SensorSeeder')
const { OutSlotSeeder } = require('../slots')
const UnknownSensor = require('../../functionalities/UnknownSensor')

class UnknownSensorSeeder extends SensorSeeder {

  static generateSlots() {
    return [
      OutSlotSeeder.generate({ name: 'value out', dataType: 'float' }),
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
