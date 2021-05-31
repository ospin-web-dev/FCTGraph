const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const Functionality = require('./Functionality')

class Actuator extends Functionality {

  static get TYPE() {
    return 'Actuator'
  }

  static get SUB_TYPES() {
    // TODO: these should really be classes
    return {
      PUMP: 'Pump',
      HEATER: 'Heater',
    }
  }

  static get SCHEMA() {
    return Joi.object({
      type: Joi.string().allow(Actuator.TYPE).required(),
      subType: Joi.string().allow(...Object.values(Actuator.SUB_TYPES)), // todo abstratto class
    }).concat(super.SCHEMA)
  }

  constructor({ subType, ...functionalityData }) {
    super(functionalityData)
    this.subType = subType

    this.assertStructure()
  }

  serialize() {
    return {
      ...super.serialize(),
      subType: this.subType,
    }
  }

}

module.exports = (
  JOIous(Actuator)
)
