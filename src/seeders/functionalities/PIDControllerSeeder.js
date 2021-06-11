const ControllerSeeder = require('seeders/functionalities/ControllerSeeder')
const { InSlotSeeder, OutSlotSeeder } = require('seeders/slots')
const PIDController = require('functionalities/PIDController')

class PIDControllerSeeder extends ControllerSeeder {

  static get SLOT_SEEDS() {
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
    const fctData = {
      ...super.generate(overrideData),
      subType: PIDController.SUB_TYPE,
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
