const Joi = require('joi')

const Slot = require('./Slot')
const SlotConnectionError = require('./SlotConnectionError')

class InSlot extends Slot {

  static get TYPE() {
    return 'InSlot'
  }

  static get CONTROLLER_PARAMETER_DISPLAY_TYPE() {
    return 'controller parameter'
  }

  static get SCHEMA() {
    return super.SCHEMA.concat(Joi.object({
      type: Joi.string().allow(this.TYPE).required(),
      dataStreams: super.SCHEMA.extract('dataStreams').max(1),
    }))
  }

  get isControllerParameter() {
    return this.displayType === InSlot.CONTROLLER_PARAMETER_DISPLAY_TYPE
  }

  _assertHasRoomForConnectionTo(otherSlot) {
    if (this.dataStreams.length > 0) {
      throw new SlotConnectionError(this, otherSlot, `${InSlot.TYPE} can only have a single dataStream`)
    }
  }

  get sourceSlot() {
    return super.connectedSlots[0]
  }

  get isInSlot() { return true } // eslint-disable-line

  get derivedUnit() {
    const derivedUnit = super.derivedUnit
    return derivedUnit || (this.sourceSlot && this.sourceSlot.derivedUnit) || this.unit
  }

  get InputNodeId(){
      const inputNode = this.connectedFunctionalities
        .find(({ type, source }) => (
          type === 'InputNode' && source.name === 'ospin-webapp'))
      return inputNode ? inputNode.id : null
  }

}

module.exports = InSlot
