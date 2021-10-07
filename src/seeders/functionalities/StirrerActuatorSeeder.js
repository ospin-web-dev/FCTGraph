const ActuatorSeeder = require('./ActuatorSeeder')
const { FloatInSlotSeeder } = require('../slots')
const StirrerActuator = require('../../functionalities/StirrerActuator')

class StirrerActuatorSeeder extends ActuatorSeeder {

  static generateSlots() {
    return [
      FloatInSlotSeeder.generate({ name: 'target value', unit: '-' }),
    ]
  }

  static generate(overrideData = {}) {
    return {
      ...super.generate(overrideData),
      subType: StirrerActuator.SUB_TYPE,
      slots: this.generateSlots(),
      ...overrideData,
    }
  }

}

module.exports = StirrerActuatorSeeder
