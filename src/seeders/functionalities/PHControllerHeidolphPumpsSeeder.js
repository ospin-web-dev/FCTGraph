const PHControllerHeidolphPumps = require('../../functionalities/PHControllerHeidolphPumps')
const PumpActuatorSeeder = require('./PumpActuatorSeeder')
const { FloatInSlotSeeder } = require('../slots')

class PHControllerHeidolphPumpsSeeder extends PumpActuatorSeeder {

  static generateSlots() {
    return [
      FloatInSlotSeeder.generate({ name: 'target value', unit: '-' }),
    ]
  }

  static generate(overrideData = {}) {
    return {
      ...super.generate(overrideData),
      subType: PHControllerHeidolphPumps.SUB_TYPE,
      slots: this.generateSlots(),
      ...overrideData,
    }
  }

}

module.exports = PHControllerHeidolphPumpsSeeder
