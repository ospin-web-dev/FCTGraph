const StirrerActuatorSeeder = require('./StirrerActuatorSeeder')
const { FloatInSlotSeeder } = require('../slots')
const HeiTorqueUltimate400 = require('../../functionalities/HeiTorqueUltimate400')

class HeiTorqueUltimate400Seeder extends StirrerActuatorSeeder {

  static generateSlots() {
    return [
      FloatInSlotSeeder.generate({ name: 'target value', unit: '-' }),
    ]
  }

  static generate(overrideData = {}) {
    return {
      ...super.generate(overrideData),
      subType: HeiTorqueUltimate400.SUB_TYPE,
      slots: this.generateSlots(),
      ...overrideData,
    }
  }

}

module.exports = HeiTorqueUltimate400Seeder
