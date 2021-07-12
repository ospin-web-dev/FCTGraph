const ControllerSeeder = require('./ControllerSeeder')
const { FloatInSlotSeeder, OutSlotSeeder } = require('../slots')
const PIDController = require('../../functionalities/PIDController')

class PIDControllerSeeder extends ControllerSeeder {

  static generateSlots() {
    return [
      FloatInSlotSeeder.generateUnitlessIn({ name: 'P' }),
      FloatInSlotSeeder.generateUnitlessIn({ name: 'I' }),
      FloatInSlotSeeder.generateUnitlessIn({ name: 'D' }),
      FloatInSlotSeeder.generate({ name: 'target in' }),
      FloatInSlotSeeder.generate({ name: 'value in' }),
      OutSlotSeeder.generate({ name: 'value out', dataType: 'float' }),
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
  static generateTemperatureControllerCelcius(data) {
    const slots = [
      FloatInSlotSeeder.generateUnitlessIn({ name: 'P' }),
      FloatInSlotSeeder.generateUnitlessIn({ name: 'I' }),
      FloatInSlotSeeder.generateUnitlessIn({ name: 'D' }),
      FloatInSlotSeeder.generateCelciusIn(),
      OutSlotSeeder.generate({ name: 'value out', dataType: 'float' }),
    ]

    return this.generate({ slots, name: 'TemperaturePIDController', ...data })
  }

}

module.exports = PIDControllerSeeder
