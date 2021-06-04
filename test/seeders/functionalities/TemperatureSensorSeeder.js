const SensorSeeder = require('test/seeders/functionalities/SensorSeeder')
const { OutSlotSeeder } = require('test/seeders/slots')
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

}

module.exports = TemperatureSensorSeeder
