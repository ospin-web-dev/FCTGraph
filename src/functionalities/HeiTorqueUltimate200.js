const JOIous = require('../mixins/instanceMixins/JOIous')
const StirrerActuator = require('./StirrerActuator')

class HeiTorqueUltimate200 extends StirrerActuator {

  static get SUB_TYPE() {
    return 'HeiTorqueUltimate200'
  }

}

module.exports = (
  JOIous(HeiTorqueUltimate200)
)
