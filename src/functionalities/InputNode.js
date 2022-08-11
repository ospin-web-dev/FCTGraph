const Joi = require('joi')

const Functionality = require('./Functionality')

class InputNode extends Functionality {

  static get SLOT_NAME() {
    return 'output'
  }

  static get TYPE() {
    return 'InputNode'
  }

  static get SCHEMA() {
    return Joi.object({
      // deprecated, will be removed after DB migration
      source: Joi.object({ name: Joi.string() }),
    }).concat(super.SCHEMA)
  }

  constructor({
    ...functionalityData
  }) {
    super({
      isVirtual: true,
      ...functionalityData,
    })
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
    }
  }

}

module.exports = InputNode
