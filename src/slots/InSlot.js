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
      type: Joi.string().allow(InSlot.TYPE).required(),
      dataStreams: super.SCHEMA.extract('dataStreams').max(1),
      displayType: super.SCHEMA.extract('displayType').allow(InSlot.CONTROLLER_PARAMETER_DISPLAY_TYPE),
    }))
  }

  constructor(slotData) {
    super(slotData)
    this.type = InSlot.TYPE
  }

  serialize() {
    const dataObj = {
      type: this.type,
      ...super.serialize(),
    }

    return dataObj
  }

  get isControllerParameter() {
    return this.displayType === InSlot.CONTROLLER_PARAMETER_DISPLAY_TYPE
  }

  _assertHasRoomForConnectionTo(otherSlot) {
    if (this.dataStreams.length > 0) {
      throw new SlotConnectionError(this, otherSlot, `${InSlot.TYPE} can only have a single dataStream`)
    }
  }

  get isInSlot() { return this.type === InSlot.TYPE }

}

module.exports = InSlot
