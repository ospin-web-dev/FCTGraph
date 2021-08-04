const Joi = require('joi')

const Slot = require('./Slot')
const SlotConnectionError = require('./SlotConnectionError')

class InSlot extends Slot {

  static get TYPE() {
    return 'InSlot'
  }

  static get SCHEMA() {
    return Joi.object({
      type: Joi.string().allow(InSlot.TYPE).required(),
    }).concat(super.SCHEMA)
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

  _assertHasRoomForConnectionTo(otherSlot) {
    if (this.dataStreams.length > 0) {
      throw new SlotConnectionError(this, otherSlot, `${InSlot.TYPE} can only have a single dataStream`)
    }
  }

}

module.exports = InSlot
