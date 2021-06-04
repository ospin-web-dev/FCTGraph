const Joi = require('joi')

const JOIous = require('mixins/instanceMixins/JOIous')
const RegexUtils = require('utils/RegexUtils')
const FunctionalityFactory = require('functionalities/factories/FunctionalityFactory')
const Functionality = require('functionalities/Functionality')

class FCTGraph {

  static get SCHEMA() {
    return Joi.object({
      id: Joi.string().pattern(RegexUtils.UUIDV4).required(),
      deviceId: Joi.string().pattern(RegexUtils.UUIDV4).required(),
      deviceDefault: Joi.boolean().default(false),
      native: Joi.boolean().default(true),
      functionalities: Joi.array().items(Functionality.SCHEMA).default([]),
    })
  }

  static deepEquals(fctGraphA, fctGraphB) {
    throw new Error(`implement me! ${fctGraphA} ${fctGraphB}`)
  }

  constructor({
    id,
    deviceId,
    deviceDefault,
    functionalities,
  }) {
    this.id = id
    this.deviceId = deviceId
    this.deviceDefault = deviceDefault
    // Avoids blowing up in the constructor. Joi gives better errors
    this.functionalities = Array.isArray(functionalities)
      ? functionalities.map(FunctionalityFactory.new)
      : []
  }

  serialize() {
    return {
      id: this.id,
      deviceId: this.deviceId,
      deviceDefault: this.deviceDefault,
      functionalities: this.functionalities.forEach(func => func.serialize),
    }
  }

  deepEquals(otherFctGraph) {
    return FCTGraph.deepEquals(this, otherFctGraph)
  }

}

module.exports = (
  JOIous(FCTGraph)
)
