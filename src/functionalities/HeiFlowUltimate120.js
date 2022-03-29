const JOIous = require('../mixins/instanceMixins/JOIous')
const PumpActuator = require('./Actuator')

class HeiFlowUltimate120 extends PumpActuator {

  static get SUB_TYPE() {
    return 'HeiFlowUltimate120'
  }

}

module.exports = (
  JOIous(HeiFlowUltimate120)
)
