const Joi = require('joi')

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

  constructor({ subType, ...controllerData }) {
    super(controllerData)
    this.subType = subType
  }

  serialize() {
    return {
      ...super.serialize(),
      subType: this.subType,
    }
  }

}

module.exports = PIDController
