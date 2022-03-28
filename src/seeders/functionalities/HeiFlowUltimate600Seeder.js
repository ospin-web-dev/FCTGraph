const PumpActuatorSeeder = require('./PumpActuatorSeeder')
const { FloatInSlotSeeder } = require('../slots')
const HeiFlowUltimate600 = require('../../functionalities/HeiFlowUltimate600')

class HeiFlowUltimate600Seeder extends PumpActuatorSeeder {

  static generateSlots() {
    return [
      FloatInSlotSeeder.generate({ name: 'target value', unit: '-' }),
    ]
  }

  static generate(overrideData = {}) {
    return {
      ...super.generate(overrideData),
      subType: HeiFlowUltimate600.SUB_TYPE,
      slots: this.generateSlots(),
      ...overrideData,
    }
  }

}

module.exports = HeiFlowUltimate600Seeder
