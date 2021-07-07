const Joi = require('joi')

const Slot = require('./Slot')

class InSlot extends Slot {

  static get TYPE() {
    return 'InSlot'
  }

  static get SCHEMA() {
    return Joi.object({
      type: Joi.string().allow(InSlot.TYPE).required(),
      tareable: Joi.boolean().required(),
    }).concat(super.SCHEMA)
  }

  constructor({
    type,
    tareable,
    ...slotData
  }) {
    super(slotData)
    this.type = type
    this.tareable = tareable || false
  }

  serialize() {
    const dataObj = {
      type: this.type,
      tareable: this.tareable,
      ...super.serialize(),
    }

    return dataObj
  }

}

module.exports = InSlot
