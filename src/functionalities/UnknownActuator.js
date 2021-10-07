const JOIous = require('../mixins/instanceMixins/JOIous')
const Actuator = require('./Actuator')

class UnknownActuator extends Actuator {

  static get SUB_TYPE() {
    return 'UnknownActuator'
  }

}

module.exports = (
  JOIous(UnknownActuator)
)
