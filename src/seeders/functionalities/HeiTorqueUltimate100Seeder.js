const StirrerActuatorSeeder = require('./StirrerActuatorSeeder')
const { FloatInSlotSeeder } = require('../slots')
const HeiTorqueUltimate100 = require('../../functionalities/HeiTorqueUltimate100')

class HeiTorqueUltimate100Seeder extends StirrerActuatorSeeder {

  static generateSlots() {
    return [
      FloatInSlotSeeder.generate({ name: 'target value', unit: '-' }),
    ]
  }

  static generate(overrideData = {}) {
    return {
      ...super.generate(overrideData),
      subType: HeiTorqueUltimate100.SUB_TYPE,
      slots: this.generateSlots(),
      ...overrideData,
    }
  }

}

module.exports = HeiTorqueUltimate100Seeder
