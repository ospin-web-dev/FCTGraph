const JOIous = require('../mixins/instanceMixins/JOIous')
const Controller = require('./Controller')

class HysteresisController extends Controller {

  static get SUB_TYPE() {
    return 'HysteresisController'
  }

}

module.exports = (
  JOIous(HysteresisController)
)
