const JOIous = require('../mixins/instanceMixins/JOIous')
const StirrerActuator = require('./StirrerActuator')

// this stirrer is a full heater/temp/controller in addition to a stirrer
class HeidolphMagneticStirrer extends StirrerActuator {

  static get SUB_TYPE() {
    return 'HeidolphMagneticStirrer'
  }

}

module.exports = (
  JOIous(HeidolphMagneticStirrer)
)
