const SensorSeeder = require('seeders/functionalities/SensorSeeder')
const { OutSlotSeeder } = require('seeders/slots')
const TemperatureSensor = require('functionalities/TemperatureSensor')

class TemperatureSensorSeeder extends SensorSeeder {

  static get SLOT_SEEDS() {
    return [
      OutSlotSeeder.generate({ name: 'value out', dataType: 'float' }),
    ]
  }

  static generate(overrideData = {}) {
    const fctData = {
      ...super.generate(overrideData),
      subType: TemperatureSensor.SUB_TYPE,
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
  static generateCelciusProducer(data) {
    const slots = [ OutSlotSeeder.generateCelciusOut(data) ]

    return this.generate({ slots, name: 'Temperature Producer' })
  }

}

module.exports = TemperatureSensorSeeder
