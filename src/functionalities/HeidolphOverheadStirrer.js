const JOIous = require('../mixins/instanceMixins/JOIous')
const StirrerActuator = require('./StirrerActuator')

class HeidolphOverheadStirrer extends StirrerActuator {

  static get SUB_TYPE() {
    return 'HeidolphOverheadStirrer'
  }

}

module.exports = (
  JOIous(HeidolphOverheadStirrer)
)
