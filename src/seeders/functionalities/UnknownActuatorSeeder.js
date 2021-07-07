const ActuatorSeeder = require('./ActuatorSeeder')
const { InSlotSeeder } = require('../slots')
const UnknownActuator = require('../../functionalities/UnknownActuator')

class UnknownActuatorSeeder extends ActuatorSeeder {

  static generateSlots() {
    return [
      InSlotSeeder.generate({ name: 'target value', dataType: 'float', unit: '-' }),
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
