const Joi = require('joi')

const Functionality = require('./Functionality')

class Sensor extends Functionality {

  static get TYPE() {
    return 'Sensor'
  }

  static get SCHEMA() {
    return Joi.object({
      type: Joi.string().allow(Sensor.TYPE).required(),
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

module.exports = Sensor