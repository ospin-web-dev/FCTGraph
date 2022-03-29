const JOIous = require('../mixins/instanceMixins/JOIous')
const StirrerActuator = require('./StirrerActuator')

// this stirrer is a full heater/temp/controller in addition to a stirrer
class HeiConnect extends StirrerActuator {

  static get SUB_TYPE() {
    return 'HeiConnect'
  }

}

module.exports = (
  JOIous(HeiConnect)
)
