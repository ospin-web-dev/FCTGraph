const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const Controller = require('./Controller')

class PIDController extends Controller {

  static get SUB_TYPE() {
    return 'PIDController'
  }

  static get SCHEMA() {
    return Joi.object({
      subType: Joi.string().allow(PIDController.SUB_TYPE).required(),
    }).concat(super.SCHEMA)
  }

  constructor(controllerData) {
    super(controllerData)
    this.subType = PIDController.SUB_TYPE
  }

  serialize() {
    return {
      ...super.serialize(),
      subType: this.subType,
    }
  }

}

module.exports = (
  JOIous(PIDController)
)
