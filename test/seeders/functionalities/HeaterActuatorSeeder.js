const ActuatorSeeder = require('test/seeders/functionalities/ActuatorSeeder')
const { InSlotSeeder } = require('test/seeders/slots')
const HeaterActuator = require('functionalities/HeaterActuator')

class HeaterActuatorSeeder extends ActuatorSeeder {

  static get SLOT_SEEDS() {
    return [
      InSlotSeeder.generate({ name: 'target value', dataType: 'float', unit: '-' }),
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

  /* *******************************************************************
   * PRESETS
   * **************************************************************** */
  static generateKelvinHeater(data) {
    const slots = [ InSlotSeeder.generateKelvinIn(data) ]

    return this.generate({ slots, name: 'Kelvin Heater' })
  }

}

module.exports = HeaterActuatorSeeder
