const JOIous = require('../mixins/instanceMixins/JOIous')
const Controller = require('./Controller')

class PHControllerHeidolphPumps extends Controller {

  static get SUB_TYPE() {
    return 'PHControllerHeidolphPumps'
  }

}

module.exports = (
  JOIous(PHControllerHeidolphPumps)
)
