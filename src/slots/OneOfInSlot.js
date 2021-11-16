const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const InSlot = require('./InSlot')

class OneOfInSlot extends InSlot {

  static get DATA_TYPE() {
    return 'oneOf'
  }

  static get SCHEMA() {
    return Joi.object({
      defaultValue: Joi.any().valid(Joi.in('selectOptions')).allow(null),
      selectOptions: Joi.array(),
    }).concat(super.SCHEMA)
  }

  constructor({ defaultValue = null, selectOptions = [], ...slotData }) {
    super(slotData)
    this.defaultValue = defaultValue
    this.selectOptions = selectOptions
  }

  serialize() {
    const dataObj = {
      defaultValue: this.defaultValue,
      selectOptions: this.selectOptions,
      ...super.serialize(),
    }

    return dataObj
  }

}

module.exports = JOIous(OneOfInSlot)
