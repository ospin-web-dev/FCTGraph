const JOIous = require('../mixins/instanceMixins/JOIous')
const Actuator = require('./Actuator')

class PumpActuator extends Actuator {

  static get SUB_TYPE() {
    return 'PumpActuator'
  }

}

module.exports = (
  JOIous(PumpActuator)
)
