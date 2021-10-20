const Joi = require('joi')

const Functionality = require('./Functionality')

class InputNode extends Functionality {

  static get TYPE() {
    return 'InputNode'
  }

  static get VALID_SOURCES() {
    return {
      OSPIN_WEBAPP: { name: 'ospin-webapp' },
      UNSPECIFIED: { name: 'unspecified' },
    }
  }

  static get VALID_SOURCE_NAMES() {
    return Object.values(InputNode.VALID_SOURCES).map(({ name }) => name)
  }

  static get DEFAULT_SOURCE() {
    return InputNode.VALID_SOURCES.UNSPECIFIED
  }

  static get SCHEMA() {
    return Joi.object({
      source: Joi.object({
        name: Joi.string().allow(...InputNode.VALID_SOURCE_NAMES).required(),
      }),
    }).concat(super.SCHEMA)
  }

  constructor({
    source = InputNode.DEFAULT_SOURCE,
    ...functionalityData
  }) {
    super({
      isVirtual: true,
      ...functionalityData,
    })
    this.source = source
  }

  get isInputNode() { return true }

  getSinkFct() {
    return super.sinks[0]
  }

  getConnectingSinkSlot() {
    return this.slots[0].connectedSlots[0]
  }

  serialize() {
    return {
      ...super.serialize(),
      source: this.source,
    }
  }

}

module.exports = InputNode
