const Functionality = require('./Functionality')

class InputNode extends Functionality {

  static get TYPE() {
    return 'InputNode'
  }

  constructor(functionalityData) {
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

}

module.exports = InputNode
