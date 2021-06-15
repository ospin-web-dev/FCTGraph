const SensorSeeder = require('seeders/functionalities/SensorSeeder')
const { OutSlotSeeder } = require('seeders/slots')
const TemperatureSensor = require('functionalities/TemperatureSensor')

class TemperatureSensorSeeder extends SensorSeeder {

  static generateSlots() {
    return [
      OutSlotSeeder.generate({ name: 'value out', dataType: 'float' }),
    ]
  }

  static generate(overrideData = {}) {
    return {
      ...super.generate(overrideData),
      subType: TemperatureSensor.SUB_TYPE,
      slots: this.generateSlots(),
      ...overrideData,
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
