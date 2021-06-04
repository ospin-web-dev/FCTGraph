const ActuatorSeeder = require('test/seeders/functionalities/ActuatorSeeder')
const { InSlotSeeder } = require('test/seeders/slots')
const HeaterActuator = require('functionalities/HeaterActuator')

class HeaterActuatorSeeder extends ActuatorSeeder {

  static get SLOT_SEEDS() {
    return [
      InSlotSeeder.generate({ name: 'target value', dataType: 'float' }),
    ]
  }

  static generate(data) {
    return {
      ...super.generate(data),
      subType: HeaterActuator.SUB_TYPE,
      slots: [ ...this.SLOT_SEEDS ],
      ...data,
    }
  }

}

module.exports = HeaterActuatorSeeder
