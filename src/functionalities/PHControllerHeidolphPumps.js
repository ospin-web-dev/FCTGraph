const JOIous = require('../mixins/instanceMixins/JOIous')
const PumpActuator = require('./Actuator')

class PHControllerHeidolphPumps extends PumpActuator {

  static get SUB_TYPE() {
    return 'PHControllerHeidolphPumps'
  }

}

module.exports = (
  JOIous(PHControllerHeidolphPumps)
)
