const ControllerSeeder = require('seeders/functionalities/ControllerSeeder')
const { InSlotSeeder, OutSlotSeeder } = require('seeders/slots')
const PIDController = require('functionalities/PIDController')

class PIDControllerSeeder extends ControllerSeeder {

  static generateSlots() {
    return [
      InSlotSeeder.generateUnitlessIn({ name: 'P', dataType: 'float' }),
      InSlotSeeder.generateUnitlessIn({ name: 'I', dataType: 'float' }),
      InSlotSeeder.generateUnitlessIn({ name: 'D', dataType: 'float' }),
      InSlotSeeder.generate({ name: 'target in', dataType: 'float' }),
      InSlotSeeder.generate({ name: 'value in', dataType: 'float' }),
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
      InSlotSeeder.generateUnitlessIn({ name: 'P', dataType: 'float' }),
      InSlotSeeder.generateUnitlessIn({ name: 'I', dataType: 'float' }),
      InSlotSeeder.generateUnitlessIn({ name: 'D', dataType: 'float' }),
      InSlotSeeder.generateCelciusIn(),
      OutSlotSeeder.generate({ name: 'value out', dataType: 'float' }),
    ]

    return this.generate({ slots, name: 'TemperaturePIDController', ...data })
  }

}

module.exports = PIDControllerSeeder
