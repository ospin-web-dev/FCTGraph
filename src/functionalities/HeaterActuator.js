const Joi = require('joi')

const Actuator = require('./Actuator')

class HeaterActuator extends Actuator {

  static get SUB_TYPE() {
    return 'HeaterActuator'
  }

  static get SCHEMA() {
    return Joi.object({
      subType: Joi.string().allow(HeaterActuator.SUB_TYPE).required(),
    }).concat(super.SCHEMA)
  }

  constructor({ subType, ...actuatorData }) {
    super(actuatorData)
    this.subType = subType
  }

  serialize() {
    return {
      ...super.serialize(),
      subType: this.subType,
    }
  }

}

module.exports = HeaterActuator
