const StirrerActuatorSeeder = require('./StirrerActuatorSeeder')
const { FloatInSlotSeeder } = require('../slots')
const HeiTorqueUltimate200 = require('../../functionalities/HeiTorqueUltimate200')

class HeiTorqueUltimate200Seeder extends StirrerActuatorSeeder {

  static generateSlots() {
    return [
      FloatInSlotSeeder.generate({ name: 'target value', unit: '-' }),
    ]
  }

  static generate(overrideData = {}) {
    return {
      ...super.generate(overrideData),
      subType: HeiTorqueUltimate200.SUB_TYPE,
      slots: this.generateSlots(),
      ...overrideData,
    }
  }

}

module.exports = HeiTorqueUltimate200Seeder
