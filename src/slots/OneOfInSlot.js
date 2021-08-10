const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const InSlot = require('./InSlot')

class OneOfInSlot extends InSlot {

  static get DATA_TYPE() {
    return 'oneOf'
  }

  static get SCHEMA() {
    return Joi.object({
      dataType: Joi.string().allow(OneOfInSlot.DATA_TYPE).required(),
      defaultValue: Joi.any().valid(Joi.in('selectOptions')).allow(null),
      selectOptions: Joi.array().required(),
    }).concat(super.SCHEMA)
  }

  constructor({ defaultValue = null, selectOptions, ...slotData }) {
    super(slotData)
    this.dataType = OneOfInSlot.DATA_TYPE
    this.defaultValue = defaultValue
    this.selectOptions = selectOptions
  }

  serialize() {
    const dataObj = {
      dataType: this.dataType,
      defaultValue: this.defaultValue,
      selectOptions: this.selectOptions,
      ...super.serialize(),
    }

    return dataObj
  }

}

module.exports = JOIous(OneOfInSlot)