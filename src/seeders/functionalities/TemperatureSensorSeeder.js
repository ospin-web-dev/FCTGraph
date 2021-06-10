const SensorSeeder = require('seeders/functionalities/SensorSeeder')
const { OutSlotSeeder } = require('seeders/slots')
const TemperatureSensor = require('functionalities/TemperatureSensor')

class TemperatureSensorSeeder extends SensorSeeder {

  static get SLOT_SEEDS() {
    return [
      OutSlotSeeder.generate({ name: 'value out', dataType: 'float' }),
    ]
  }

  static generate(data) {
    return {
      ...super.generate(data),
      subType: TemperatureSensor.SUB_TYPE,
      slots: [ ...this.SLOT_SEEDS ],
      ...data,
    }
  }

  /* *******************************************************************
   * PRESETS
   * **************************************************************** */
  static generateCelciusProducer(data) {
    const slots = [ OutSlotSeeder.generateCelciusOut(data) ]

    return this.generate({ slots, name: 'Temperature Producer' })
  }

}

module.exports = TemperatureSensorSeeder
