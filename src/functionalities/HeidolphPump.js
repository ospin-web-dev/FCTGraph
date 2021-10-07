const JOIous = require('../mixins/instanceMixins/JOIous')
const PumpActuator = require('./Actuator')

class HeidolphPump extends PumpActuator {

  static get SUB_TYPE() {
    return 'HeidolphPump'
  }

}

module.exports = (
  JOIous(HeidolphPump)
)
