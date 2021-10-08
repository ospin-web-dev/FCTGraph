const ActuatorSeeder = require('./ActuatorSeeder')
const { FloatInSlotSeeder } = require('../slots')
const PumpActuator = require('../../functionalities/PumpActuator')

class PumpActuatorSeeder extends ActuatorSeeder {

  static generateSlots() {
    return [
      FloatInSlotSeeder.generate({ name: 'target value', unit: '-' }),
    ]
  }

  static generate(overrideData = {}) {
    return {
      ...super.generate(overrideData),
      subType: PumpActuator.SUB_TYPE,
      slots: this.generateSlots(),
      ...overrideData,
    }
  }

}

module.exports = PumpActuatorSeeder
