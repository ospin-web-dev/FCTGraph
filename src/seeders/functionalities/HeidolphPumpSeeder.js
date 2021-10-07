const PumpActuatorSeeder = require('./PumpActuatorSeeder')
const { FloatInSlotSeeder } = require('../slots')
const HeidolphPump = require('../../functionalities/HeidolphPump')

class HeidolphPumpSeeder extends PumpActuatorSeeder {

  static generateSlots() {
    return [
      FloatInSlotSeeder.generate({ name: 'target value', unit: '-' }),
    ]
  }

  static generate(overrideData = {}) {
    return {
      ...super.generate(overrideData),
      subType: HeidolphPump.SUB_TYPE,
      slots: this.generateSlots(),
      ...overrideData,
    }
  }

}

module.exports = HeidolphPumpSeeder
