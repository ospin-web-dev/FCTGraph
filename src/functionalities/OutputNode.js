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

  get isOutputNode() { return true }

  serialize() {
    return {
      ...super.serialize(),
      type: this.type,
      destination: this.destination,
    }
  }

  get source() {
    const { sources, name } = this

    if (sources.length > 1) {
      throw new Error(`Output Node: ${name} has more than one connected fct. Output nodes may only have one source. Current sources: ${sources}`)
    }

    return sources[0]
  }

}

module.exports = OutputNode
