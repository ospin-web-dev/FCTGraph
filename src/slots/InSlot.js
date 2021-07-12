const Joi = require('joi')

const Slot = require('./Slot')

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

}

module.exports = InSlot
