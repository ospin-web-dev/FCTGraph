const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const Actuator = require('./Actuator')

class UnknownActuator extends Actuator {

  static get SUB_TYPE() {
    return 'UnknownActuator'
  }

  static get SCHEMA() {
    return Joi.object({
      subType: Joi.string().allow(UnknownActuator.TYPE).required(),
    }).concat(super.SCHEMA)
  }

  constructor(actuatorData) {
    super(actuatorData)
    this.subType = UnknownActuator.SUB_TYPE
  }

  serialize() {
    return {
      ...super.serialize(),
      subType: this.subType,
    }
  }

}

module.exports = (
  JOIous(UnknownActuator)
)
