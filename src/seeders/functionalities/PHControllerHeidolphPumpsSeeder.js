const PHControllerHeidolphPumps = require('../../functionalities/PHControllerHeidolphPumps')
const ControllerSeeder = require('./ControllerSeeder')
const { FloatInSlotSeeder } = require('../slots')

class PHControllerHeidolphPumpsSeeder extends ControllerSeeder {

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
