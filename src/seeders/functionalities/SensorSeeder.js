const PhysicalFunctionalitySeeder = require('./PhysicalFunctionalitySeeder')
const Sensor = require('../../functionalities/Sensor')

class SensorSeeder extends PhysicalFunctionalitySeeder {

  static generate(data) {
    return {
      ...super.generate(data),
      type: Sensor.TYPE,
      ...data,
    }
  }

}

module.exports = SensorSeeder
