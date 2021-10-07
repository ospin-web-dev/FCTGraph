const JOIous = require('../mixins/instanceMixins/JOIous')
const Actuator = require('./Actuator')

class HeaterActuator extends Actuator {

  static get SUB_TYPE() {
    return 'HeaterActuator'
  }

}

module.exports = (
  JOIous(HeaterActuator)
)
