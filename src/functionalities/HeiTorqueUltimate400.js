const JOIous = require('../mixins/instanceMixins/JOIous')
const StirrerActuator = require('./StirrerActuator')

class HeiTorqueUltimate400 extends StirrerActuator {

  static get SUB_TYPE() {
    return 'HeiTorqueUltimate400'
  }

}

module.exports = (
  JOIous(HeiTorqueUltimate400)
)
