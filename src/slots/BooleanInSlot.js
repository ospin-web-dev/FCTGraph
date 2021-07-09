const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const InSlot = require('./InSlot')

class BooleanInSlot extends InSlot {

  static get DATA_TYPE() {
    return 'boolean'
  }

  static get SCHEMA() {
    return Joi.object({
      dataType: Joi.string().allow(BooleanInSlot.DATA_TYPE).required(),
      defaultValue: Joi.boolean().allow(null),
    }).concat(super.SCHEMA)
  }

  constructor({ defaultValue = null, ...slotData }) {
    super(slotData)
    this.dataType = BooleanInSlot.DATA_TYPE
    this.defaultValue = defaultValue
  }

  serialize() {
    const dataObj = {
      dataType: this.dataType,
      defaultValue: this.defaultValue,
      ...super.serialize(),
    }

    return dataObj
  }

}

module.exports = JOIous(BooleanInSlot)
