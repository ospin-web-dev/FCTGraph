const JOIous = require('../mixins/instanceMixins/JOIous')
const Actuator = require('./Actuator')

class StirrerActuator extends Actuator {

  static get SUB_TYPE() {
    return 'StirrerActuator'
  }

}

module.exports = (
  JOIous(StirrerActuator)
)
