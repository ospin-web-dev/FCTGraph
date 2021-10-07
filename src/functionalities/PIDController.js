const JOIous = require('../mixins/instanceMixins/JOIous')
const Controller = require('./Controller')

class PIDController extends Controller {

  static get SUB_TYPE() {
    return 'PIDController'
  }

}

module.exports = (
  JOIous(PIDController)
)
