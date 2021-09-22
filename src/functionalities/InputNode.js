const Joi = require('joi')

const Functionality = require('./Functionality')

class InputNode extends Functionality {

  static get TYPE() {
    return 'InputNode'
  }

  static get SCHEMA() {
    return Joi.object({
      type: Joi.string().allow(InputNode.TYPE).required(),
    }).concat(super.SCHEMA)
  }

  constructor(functionalityData) {
    super({
      isVirtual: true,
      ...functionalityData,
    })
    this.type = InputNode.TYPE
  }

  get isInputNode() { return true }

  serialize() {
    return {
      ...super.serialize(),
      type: this.type,
    }
  }

  getSinkFct() {
    return super.sinks[0]
  }

  getConnectingSinkSlot() {
    return this.slots[0].connectedSlots[0]
  }

}

module.exports = InputNode
