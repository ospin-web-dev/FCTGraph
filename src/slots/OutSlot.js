const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const Slot = require('./Slot')

class OutSlot extends Slot {

  static get TYPE() {
    return 'OutSlot'
  }

  static get SCHEMA() {
    return Joi.object({
      type: Joi.string().allow(OutSlot.TYPE).required(),
    }).concat(super.SCHEMA)
  }

  constructor({ type, ...slotData }) {
    super(slotData)
    this.type = type

    this.assertStructure()
  }

  serialize() {
    return {
      ...super.serialize(),
      type: this.type,
    }
  }

}

module.exports = (
  JOIous(OutSlot)
)
