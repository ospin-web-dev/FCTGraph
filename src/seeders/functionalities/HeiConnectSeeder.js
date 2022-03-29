const { FloatInSlotSeeder } = require('../slots')
const StirrerActuatorSeeder = require('./StirrerActuatorSeeder')
const HeiConnect = require('../../functionalities/HeiConnect')

class HeiConnectSeeder extends StirrerActuatorSeeder {

  static generateSlots() {
    return [
      FloatInSlotSeeder.generate({ name: 'target value', unit: '-' }),
    ]
  }

  static generate(overrideData = {}) {
    return {
      ...super.generate(overrideData),
      subType: HeiConnect.SUB_TYPE,
      slots: this.generateSlots(),
      ...overrideData,
    }
  }

}

module.exports = HeiConnectSeeder
