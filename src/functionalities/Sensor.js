const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const Functionality = require('./Functionality')

class Sensor extends Functionality {

  static get SUB_TYPES() {
    return {
      TEMPERATURE_SENSOR: 'Temperature Sensor',
      FLOW_SENSOR: 'Flow Sensor',
    }
  }

  static get SCHEMA() {
    return Joi.object({
      subType: Joi.string().allow(...Object.values(Sensor.SUB_TYPES)),
    }).concat(super.SCHEMA)
  }

  constructor({ subType, ...functionalityData }) {
    super(functionalityData)
    this.subType = subType

    this.attemptStructure()
  }

  serialize() {
    return {
      ...super.serialize(),
      subType: this.subType,
    }
  }

}

module.exports = (
  JOIous(Sensor)
)
