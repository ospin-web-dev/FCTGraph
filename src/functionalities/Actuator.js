const Joi = require('joi')

const Functionality = require('./Functionality')

class Actuator extends Functionality {

  static get TYPE() {
    return 'Actuator'
  }

  static get SCHEMA() {
    return Joi.object({
      type: Joi.string().allow(Actuator.TYPE).required(),
    }).concat(super.SCHEMA)
  }

  constructor({ type, ...functionalityData }) {
    super(functionalityData)
    this.type = type
  }

  serialize() {
    return {
      ...super.serialize(),
      type: this.type,
    }
  }

}

module.exports = Actuator
