const Joi = require('joi')

const Functionality = require('./Functionality')

class OutputNode extends Functionality {

  static get SLOT_NAME() {
    return 'input'
  }

  static get TYPE() {
    return 'OutputNode'
  }

  static get SCHEMA() {
    return Joi.object({
      // deprecated, will be removed after DB migration
      destination: Joi.object({ name: Joi.string() }),
    }).concat(super.SCHEMA)
  }

  constructor({
    ...functionalityData
  }) {
    super({ isVirtual: true, ...functionalityData })
  }

  get isOutputNode() { return true }

  serialize() {
    return {
      ...super.serialize(),
    }
  }

  get source() {
    const { sources, name } = this

    if (sources.length > 1) {
      throw new Error(`Output Node: ${name} has more than one connected fct. Output nodes may only have one source. Current sources: ${sources}`)
    }

    return sources[0]
  }

  getSourceFct() {
    return super.sources[0]
  }

  getConnectingSourceSlot() {
    return this.slots[0].connectedSlots[0]
  }

}

module.exports = OutputNode
