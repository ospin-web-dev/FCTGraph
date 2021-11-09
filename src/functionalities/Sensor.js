const PhysicalFunctionality = require('./PhysicalFunctionality')

class Sensor extends PhysicalFunctionality {

  static get TYPE() {
    return 'Sensor'
  }

}

module.exports = Sensor
