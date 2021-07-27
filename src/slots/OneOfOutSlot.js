const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const OutSlot = require('./OutSlot')

class OneOfOutSlot extends OutSlot {

  static get DATA_TYPE() {
    return 'oneOf'
  }

  static get SCHEMA() {
    return Joi.object({
      dataType: Joi.string().allow(OneOfOutSlot.DATA_TYPE).required(),
    }).concat(super.SCHEMA)
  }

  constructor(slotData) {
    super(slotData)
    this.dataType = OneOfOutSlot.DATA_TYPE
  }

  serialize() {
    return {
      dataType: this.dataType,
      ...super.serialize(),
    }
  }

}

module.exports = (
  JOIous(OneOfOutSlot)
)
