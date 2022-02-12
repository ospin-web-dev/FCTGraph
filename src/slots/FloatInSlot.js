const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const InSlot = require('./InSlot')

class FloatInSlot extends InSlot {

  static get DATA_TYPE() {
    return 'float'
  }

  static get SCHEMA() {
    return super.SCHEMA.concat(Joi.object({
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
      tareable: Joi.boolean(),
      dataType: Joi.string().allow(this.DATA_TYPE).required(),
    }))
  }

  constructor({
    defaultValue = null,
    min = null,
    max = null,
    tareable = false,
    ...slotData
  }) {
    super(slotData)
    this.min = min
    this.max = max
    this.defaultValue = defaultValue
    this.tareable = tareable
  }

  serialize() {
    const dataObj = {
      min: this.min,
      max: this.max,
      defaultValue: this.defaultValue,
      tareable: this.tareable,
      ...super.serialize(),
    }

    return dataObj
  }

}

module.exports = JOIous(FloatInSlot)
