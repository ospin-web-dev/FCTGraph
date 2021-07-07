const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const InSlot = require('./InSlot')

class FloatInSlot extends InSlot {

  constructor({ defaultValue = null, dataType, min = null, max = null, ...slotData }) {
    super(slotData)
    this.dataType = dataType
    this.min = min
    this.max = max
    this.defaultValue = defaultValue
  }

  static get DATA_TYPE() {
    return 'float'
  }

  static get SCHEMA() {
    return Joi.object({
      dataType: Joi.string().allow(FloatInSlot.DATA_TYPE).required(),
      min: Joi.number().strict().allow(null),
      max: Joi.number().strict().allow(null)
        .when('min', {
          is: Joi.number().strict(),
          then: Joi.number().min(Joi.ref('min')),
        }),
      defaultValue: Joi.number().strict().allow(null)
        .when('min', {
          is: Joi.number().strict(),
          then: Joi.number().min(Joi.ref('min')),
        })
        .when('max', {
          is: Joi.number().strict(),
          then: Joi.number().max(Joi.ref('max')),
        }),
    }).concat(super.SCHEMA)
  }

  serialize() {
    const dataObj = {
      dataType: this.dataType,
      min: this.min,
      max: this.max,
      defaultValue: this.defaultValue,
      ...super.serialize(),
    }

    return dataObj
  }

}

module.exports = JOIous(FloatInSlot)
