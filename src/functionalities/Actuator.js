const PhysicalFunctionality = require('./PhysicalFunctionality')

class Actuator extends PhysicalFunctionality {

  static get TYPE() {
    return 'Actuator'
  }

}

module.exports = Actuator
