const Joi = require('joi')

const Functionality = require('./Functionality')

class OutputNode extends Functionality {

  static get TYPE() {
    return 'OutputNode'
  }

  static get VALID_DESTINATIONS() {
    return {
      OSPIN_WEBAPP: { name: 'ospin-webapp' },
      UNSPECIFIED: { name: 'unspecified' },
    }
  }

  static get VALID_DESTINATION_NAMES() {
    return Object.values(OutputNode.VALID_DESTINATIONS).map(({ name }) => name)
  }

  static get DEFAULT_DESTINATION() {
    return OutputNode.VALID_DESTINATIONS.UNSPECIFIED
  }

  static get SCHEMA() {
    return Joi.object({
      type: Joi.string().allow(OutputNode.TYPE).required(),
      destination: Joi.object({
        name: Joi.string().allow(...OutputNode.VALID_DESTINATION_NAMES).required(),
      }),
    }).concat(super.SCHEMA)
  }

  constructor({
    destination = OutputNode.DEFAULT_DESTINATION,
    ...functionalityData
  }) {
    super({ isVirtual: true, ...functionalityData })
    this.type = OutputNode.TYPE
    this.destination = destination
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
