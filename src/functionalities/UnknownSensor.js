const JOIous = require('../mixins/instanceMixins/JOIous')
const Sensor = require('./Sensor')

class UnknownSensor extends Sensor {

  static get SUB_TYPE() {
    return 'UnknownSensor'
  }

}

module.exports = (
  JOIous(UnknownSensor)
)
