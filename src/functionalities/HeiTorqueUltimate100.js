const JOIous = require('../mixins/instanceMixins/JOIous')
const StirrerActuator = require('./StirrerActuator')

class HeiTorqueUltimate100 extends StirrerActuator {

  static get SUB_TYPE() {
    return 'HeiTorqueUltimate100'
  }

}

module.exports = (
  JOIous(HeiTorqueUltimate100)
)
