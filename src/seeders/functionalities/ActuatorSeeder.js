const PhysicalFunctionalitySeeder = require('./PhysicalFunctionalitySeeder')
const Actuator = require('../../functionalities/Actuator')

class ActuatorSeeder extends PhysicalFunctionalitySeeder {

  static generate(data) {
    return {
      ...super.generate(data),
      type: Actuator.TYPE,
      ...data,
    }
  }

}

module.exports = ActuatorSeeder
