const StirrerActuatorSeeder = require('./StirrerActuatorSeeder')
const { FloatInSlotSeeder } = require('../slots')
const HeidolphOverheadStirrer = require('../../functionalities/HeidolphOverheadStirrer')

class HeidolphOverheadStirrerSeeder extends StirrerActuatorSeeder {

  static generateSlots() {
    return [
      FloatInSlotSeeder.generate({ name: 'target value', unit: '-' }),
    ]
  }

  static generate(overrideData = {}) {
    return {
      ...super.generate(overrideData),
      subType: HeidolphOverheadStirrer.SUB_TYPE,
      slots: this.generateSlots(),
      ...overrideData,
    }
  }

}

module.exports = HeidolphOverheadStirrerSeeder
