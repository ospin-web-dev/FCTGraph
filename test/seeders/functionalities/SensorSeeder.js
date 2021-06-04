const FunctionalitySeeder = require('test/seeders/functionalities/FunctionalitySeeder')
const Sensor = require('functionalities/Sensor')

class SensorSeeder extends FunctionalitySeeder {

  static generate(data) {
    return {
      ...super.generate(data),
      type: Sensor.TYPE,
      ...data,
    }
  }

}

module.exports = SensorSeeder
