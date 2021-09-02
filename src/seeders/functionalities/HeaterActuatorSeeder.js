const ActuatorSeeder = require('./ActuatorSeeder')
const { FloatInSlotSeeder } = require('../slots')
const HeaterActuator = require('../../functionalities/HeaterActuator')

class HeaterActuatorSeeder extends ActuatorSeeder {

  static generateSlots() {
    return [
      FloatInSlotSeeder.generate({ name: 'target value', unit: '-' }),
    ]
  }

  static generate(overrideData = {}) {
    return {
      ...super.generate(overrideData),
      subType: HeaterActuator.SUB_TYPE,
      slots: this.generateSlots(),
      ...overrideData,
    }
  }

  /* *******************************************************************
   * PRESETS
   * **************************************************************** */
  static generateKelvinHeater(data) {
    const slots = [ FloatInSlotSeeder.generateKelvinIn(data) ]

    return this.generate({ slots, name: 'Kelvin Heater' })
  }

  static generateCelsiusHeater(data) {
    const slots = [ FloatInSlotSeeder.generateCelsiusIn(data) ]

    return this.generate({ slots, name: 'Celsius Heater' })
  }

}

module.exports = HeaterActuatorSeeder
