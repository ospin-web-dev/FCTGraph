const ActuatorSeeder = require('seeders/functionalities/ActuatorSeeder')
const { InSlotSeeder } = require('seeders/slots')
const HeaterActuator = require('functionalities/HeaterActuator')

class HeaterActuatorSeeder extends ActuatorSeeder {

  static get SLOT_SEEDS() {
    return [
      InSlotSeeder.generate({ name: 'target value', dataType: 'float', unit: '-' }),
    ]
  }

  static generate(overrideData = {}) {
    const fctData = {
      ...super.generate(overrideData),
      subType: HeaterActuator.SUB_TYPE,
    }

    return {
      ...fctData,
      slots: [ ...this.generateSlots(overrideData.id || fctData.id) ],
      ...overrideData,
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
