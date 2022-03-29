const PumpActuatorSeeder = require('./PumpActuatorSeeder')
const { FloatInSlotSeeder } = require('../slots')
const HeiFlowUltimate120 = require('../../functionalities/HeiFlowUltimate120')

class HeiFlowUltimate120Seeder extends PumpActuatorSeeder {

  static generateSlots() {
    return [
      FloatInSlotSeeder.generate({ name: 'target value', unit: '-' }),
    ]
  }

  static generate(overrideData = {}) {
    return {
      ...super.generate(overrideData),
      subType: HeiFlowUltimate120.SUB_TYPE,
      slots: this.generateSlots(),
      ...overrideData,
    }
  }

}

module.exports = HeiFlowUltimate120Seeder
