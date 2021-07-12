const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
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

  constructor(actuatorData) {
    super(actuatorData)
    this.subType = HeaterActuator.SUB_TYPE
  }

  serialize() {
    return {
      ...super.serialize(),
      subType: this.subType,
    }
  }

}

module.exports = (
  JOIous(HeaterActuator)
)
