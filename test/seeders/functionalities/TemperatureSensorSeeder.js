const SensorSeeder = require('test/seeders/functionalities/SensorSeeder')
const TemperatureSensor = require('functionalities/TemperatureSensor')

class TemperatureSensorSeeder extends SensorSeeder {

  static generate(data) {
    return {
      ...super.generate(data),
      subType: TemperatureSensor.SUB_TYPE,
      ...data,
    }
  }

}

module.exports = TemperatureSensorSeeder
