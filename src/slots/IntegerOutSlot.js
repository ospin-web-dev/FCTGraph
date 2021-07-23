const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const OutSlot = require('./OutSlot')

class IntegerOutSlot extends OutSlot {

  static get DATA_TYPE() {
    return 'integer'
  }

  static get SCHEMA() {
    return Joi.object({
      dataType: Joi.string().allow(IntegerOutSlot.DATA_TYPE).required(),
    }).concat(super.SCHEMA)
  }

  constructor(slotData) {
    super(slotData)
    this.dataType = IntegerOutSlot.DATA_TYPE
  }

  serialize() {
    return {
      dataType: this.dataType,
      ...super.serialize(),
    }
  }

}

module.exports = (
  JOIous(IntegerOutSlot)
)
