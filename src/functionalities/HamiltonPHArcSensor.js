const JOIous = require('../mixins/instanceMixins/JOIous')
const Sensor = require('./Sensor')

class HamiltonPHArcSensor extends Sensor {

  static get SUB_TYPE() {
    return 'HamiltonPHArcSensor'
  }

}

module.exports = (
  JOIous(HamiltonPHArcSensor)
)
