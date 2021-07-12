const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const InSlot = require('./InSlot')

class IntegerInSlot extends InSlot {

  static get DATA_TYPE() {
    return 'integer'
  }

  static get SCHEMA() {
    return Joi.object({
      dataType: Joi.string().allow(IntegerInSlot.DATA_TYPE).required(),
      min: Joi.number().integer().strict().allow(null),
      max: Joi.number().integer().strict().allow(null)
        .when('min', {
          is: Joi.number().strict(),
          then: Joi.number().min(Joi.ref('min')),
        }),
      defaultValue: Joi.number().integer().strict().allow(null)
        .when('min', {
          is: Joi.number().strict(),
          then: Joi.number().integer().min(Joi.ref('min')),
        })
        .when('max', {
          is: Joi.number().strict(),
          then: Joi.number().integer().max(Joi.ref('max')),
        }),
      tareable: Joi.boolean().required(),
    }).concat(super.SCHEMA)
  }

  constructor({
    defaultValue = null,
    min = null,
    max = null,
    tareable = false,
    ...slotData
  }) {
    super(slotData)
    this.dataType = IntegerInSlot.DATA_TYPE
    this.min = min
    this.max = max
    this.defaultValue = defaultValue
    this.tareable = tareable
  }

  serialize() {
    const dataObj = {
      dataType: this.dataType,
      min: this.min,
      max: this.max,
      defaultValue: this.defaultValue,
      tareable: this.tareable,
      ...super.serialize(),
    }

    return dataObj
  }

}

module.exports = JOIous(IntegerInSlot)
