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

  constructor(functionalityData) {
    super({
      isVirtual: false,
      ...functionalityData,
    })
    this.type = Sensor.TYPE
  }

  serialize() {
    return {
      ...super.serialize(),
      type: this.type,
    }
  }

}

module.exports = Sensor
