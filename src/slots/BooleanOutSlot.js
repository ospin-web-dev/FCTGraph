const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const OutSlot = require('./OutSlot')

class BooleanOutSlot extends OutSlot {

  static get DATA_TYPE() {
    return 'boolean'
  }

  static get SCHEMA() {
    return Joi.object({
      dataType: Joi.string().allow(BooleanOutSlot.DATA_TYPE).required(),
    }).concat(super.SCHEMA)
  }

  constructor(slotData) {
    super(slotData)
    this.dataType = BooleanOutSlot.DATA_TYPE
  }

  serialize() {
    return {
      dataType: this.dataType,
      ...super.serialize(),
    }
  }

}

module.exports = (
  JOIous(BooleanOutSlot)
)
