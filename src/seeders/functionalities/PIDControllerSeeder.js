const ControllerSeeder = require('./ControllerSeeder')
const { FloatInSlotSeeder, FloatOutSlotSeeder } = require('../slots')
const PIDController = require('../../functionalities/PIDController')

class PIDControllerSeeder extends ControllerSeeder {

  static generateSlots() {
    return [
      FloatInSlotSeeder.generateUnitlessIn({ name: 'P' }),
      FloatInSlotSeeder.generateUnitlessIn({ name: 'I' }),
      FloatInSlotSeeder.generateUnitlessIn({ name: 'D' }),
      FloatInSlotSeeder.generate({ name: 'target in' }),
      FloatInSlotSeeder.generate({ name: 'value in' }),
      FloatOutSlotSeeder.generate({ name: 'value out' }),
    ]
  }

  static generate(overrideData = {}) {
    return {
      ...super.generate(overrideData),
      subType: PIDController.SUB_TYPE,
      slots: this.generateSlots(),
      ...overrideData,
    }
  }

  /* *******************************************************************
   * PRESETS
   * **************************************************************** */
  static generateTemperatureControllerCelsius(data) {
    const slots = [
      FloatInSlotSeeder.generateUnitlessIn({ name: 'P' }),
      FloatInSlotSeeder.generateUnitlessIn({ name: 'I' }),
      FloatInSlotSeeder.generateUnitlessIn({ name: 'D' }),
      FloatInSlotSeeder.generateCelsiusIn({ name: 'value in' }),
      FloatOutSlotSeeder.generateCelsiusOut({ name: 'value out' }),
    ]

    return this.generate({ slots, name: 'TemperaturePIDController', ...data })
  }

}

module.exports = PIDControllerSeeder
