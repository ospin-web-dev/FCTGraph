const ActuatorSeeder = require('./ActuatorSeeder')
const { FloatInSlotSeeder } = require('../slots')
const UnknownActuator = require('../../functionalities/UnknownActuator')

class UnknownActuatorSeeder extends ActuatorSeeder {

  static generateSlots() {
    return [
      FloatInSlotSeeder.generate({ name: 'target value', unit: '-' }),
    ]
  }

  static generate(overrideData = {}) {
    return {
      ...super.generate(overrideData),
      subType: UnknownActuator.SUB_TYPE,
      slots: this.generateSlots(),
      ...overrideData,
    }
  }

}

module.exports = UnknownActuatorSeeder
