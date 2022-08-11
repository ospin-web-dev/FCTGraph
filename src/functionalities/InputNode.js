const Functionality = require('./Functionality')

class InputNode extends Functionality {

  static get SLOT_NAME() {
    return 'output'
  }

  static get TYPE() {
    return 'InputNode'
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
