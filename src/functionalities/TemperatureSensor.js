const JOIous = require('../mixins/instanceMixins/JOIous')
const Sensor = require('./Sensor')

class TemperatureSensor extends Sensor {

  static get SUB_TYPE() {
    return 'TemperatureSensor'
  }

}

module.exports = (
  JOIous(TemperatureSensor)
)
