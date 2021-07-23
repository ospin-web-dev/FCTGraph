const Joi = require('joi')

const Functionality = require('./Functionality')

class OutputNode extends Functionality {

  static get TYPE() {
    return 'OutputNode'
  }

  static get VALID_DESTINATIONS() {
    return {
      OSPIN_WEBAPP: { name: 'unspecified' },
    }
  }

  static get DEFAULT_DESTINATION() {
    return OutputNode.VALID_DESTINATIONS
  }

  static get SCHEMA() {
    return Joi.object({
      type: Joi.string().allow(OutputNode.TYPE).required(),
      destination: Joi.object({
        destination: Joi.string().required(),
      }),
    }).concat(super.SCHEMA)
  }

  constructor(functionalityData) {
    super({
      isVirtual: true,
      ...functionalityData,
    })
    this.type = OutputNode.TYPE
    this.destination = functionalityData.destination || OutputNode.DEFAULT_DESTINATION
  }

  serialize() {
    return {
      ...super.serialize(),
      type: this.type,
      destination: this.destination,
    }
  }

}

module.exports = OutputNode
