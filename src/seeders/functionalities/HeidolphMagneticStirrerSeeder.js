const { FloatInSlotSeeder } = require('../slots')
const StirrerActuatorSeeder = require('./StirrerActuatorSeeder')
const HeidolphMagneticStirrer = require('../../functionalities/HeidolphMagneticStirrer')

class HeidolphMagneticStirrerSeeder extends StirrerActuatorSeeder {

  static generateSlots() {
    return [
      FloatInSlotSeeder.generate({ name: 'target value', unit: '-' }),
    ]
  }

  static generate(overrideData = {}) {
    return {
      ...super.generate(overrideData),
      subType: HeidolphMagneticStirrer.SUB_TYPE,
      slots: this.generateSlots(),
      ...overrideData,
    }
  }

}

module.exports = HeidolphMagneticStirrerSeeder
