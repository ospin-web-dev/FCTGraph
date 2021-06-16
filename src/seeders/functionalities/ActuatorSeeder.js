const FunctionalitySeeder = require('./FunctionalitySeeder')
const Actuator = require('../../functionalities/Actuator')

class ActuatorSeeder extends FunctionalitySeeder {

  static generate(data) {
    return {
      ...super.generate(data),
      type: Actuator.TYPE,
      ...data,
    }
  }

}

module.exports = ActuatorSeeder
