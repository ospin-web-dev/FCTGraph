const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const InSlot = require('./InSlot')

class BooleanInSlot extends InSlot {

  constructor({ defaultValue, dataType, ...slotData }) {
    super(slotData)
    this.dataType = dataType
    this.defaultValue = defaultValue
  }

  static get DATA_TYPE() {
    return 'boolean'
  }

  static get SCHEMA() {
    return Joi.object({
      dataType: Joi.string().allow(BooleanInSlot.DATA_TYPE).required(),
      defaultValue: Joi.boolean().required(),
    }).concat(super.SCHEMA)
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
