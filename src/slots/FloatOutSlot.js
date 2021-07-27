const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const OutSlot = require('./OutSlot')

class FloatOutSlot extends OutSlot {

  static get DATA_TYPE() {
    return 'float'
  }

  static get SCHEMA() {
    return Joi.object({
      dataType: Joi.string().allow(FloatOutSlot.DATA_TYPE).required(),
    }).concat(super.SCHEMA)
  }

  constructor(slotData) {
    super(slotData)
    this.dataType = FloatOutSlot.DATA_TYPE
  }

  serialize() {
    return {
      dataType: this.dataType,
      ...super.serialize(),
    }
  }

}

module.exports = (
  JOIous(FloatOutSlot)
)
