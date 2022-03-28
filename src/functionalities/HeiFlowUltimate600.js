const JOIous = require('../mixins/instanceMixins/JOIous')
const PumpActuator = require('./Actuator')

class HeiFlowUltimate600 extends PumpActuator {

  static get SUB_TYPE() {
    return 'HeiFlowUltimate600'
  }

}

module.exports = (
  JOIous(HeiFlowUltimate600)
)
