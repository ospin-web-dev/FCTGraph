const JOIous = require('../mixins/instanceMixins/JOIous')
const HysteresisController = require('./HysteresisController')

class HeidolphPumpByTorqueHysteresisController extends HysteresisController {

  static get SUB_TYPE() {
    return 'HeidolphPumpByTorqueHysteresisController'
  }

}

module.exports = (
  JOIous(HeidolphPumpByTorqueHysteresisController)
)
