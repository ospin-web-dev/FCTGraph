const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const InSlot = require('./InSlot')

class BooleanInSlot extends InSlot {

  static get DATA_TYPE() {
    return 'boolean'
  }

  static get SCHEMA() {
    return Joi.object({
      defaultValue: Joi.boolean().allow(null),
    }).concat(super.SCHEMA)
  }

  constructor({ defaultValue = null, ...slotData }) {
    super(slotData)
    this.defaultValue = defaultValue
  }

  serialize() {
    const dataObj = {
      defaultValue: this.defaultValue,
      ...super.serialize(),
    }

    return dataObj
  }

}

module.exports = JOIous(BooleanInSlot)
