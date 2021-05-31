const Joi = require('joi')

const JOIous = require('./mixins/instanceMixins/JOIous')
const RegexUtils = require('./utils/RegexUtils')
const Functionality = require('./functionalities/Functionality')

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

  constructor({
    id,
    deviceId,
    deviceDefault,
    functionalities,
  }) {
    this.id = id
    this.deviceId = deviceId
    this.deviceDefault = deviceDefault
    this.functionalities = functionalities.map(fctData => (
      new Functionality(fctData)
    ))

    this.assertStructure()
  }

  serialize() {
    return {
      id: this.id,
      deviceId: this.deviceId,
      deviceDefault: this.deviceDefault,
      functionalities: this.functionalities.forEach(func => func.serialize),
    }
  }

}

module.exports = (
  JOIous(FCTGraph)
)
