const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const Slot = require('./Slot')

class InSlot extends Slot {

  static get TYPE() {
    return 'InSlot'
  }

  static get SCHEMA() {
    return Joi.object({
      type: Joi.string().allow(InSlot.TYPE).required(),
      min: Joi.number().strict()
        .when('dataType', [
          {
            is: super.DATA_TYPES.INTEGER,
            then: Joi.required(),
          },
          {
            is: super.DATA_TYPES.FLOAT,
            then: Joi.required(),
            otherwise: Joi.forbidden(),
          },
        ]),
      max: Joi.number().strict()
        .when('min', {
          is: Joi.exist(),
          then: Joi.number().min(Joi.ref('min')),
        })
        .when('dataType', [
          {
            is: super.DATA_TYPES.INTEGER,
            then: Joi.required(),
          },
          {
            is: super.DATA_TYPES.FLOAT,
            then: Joi.required(),
            otherwise: Joi.forbidden(),
          },
        ]),
      defaultValue: Joi.any()
        .when('dataType', {
          is: super.DATA_TYPES.INTEGER,
          then: Joi.number().integer().min(Joi.ref('min')).max(Joi.ref('max'))
            .required(),
        })
        .when('dataType', {
          is: super.DATA_TYPES.FLOAT,
          then: Joi.number().min(Joi.ref('min')).max(Joi.ref('max')).required(),
        })
        .when('dataType', {
          is: super.DATA_TYPES.BOOLEAN,
          then: Joi.boolean().required(),
        })
        .when('dataType', {
          is: super.DATA_TYPES.ONE_OF,
          then: Joi.any().valid(Joi.in('selectOptions')),
        })
        .required(),
      selectOptions: Joi.array()
        .when('dataType', {
          is: super.DATA_TYPES.ONE_OF,
          then: Joi.required(),
          otherwise: Joi.forbidden(),
        }),
    }).concat(super.SCHEMA)
  }

  constructor({ type, min, max, defaultValue, selectOptions, ...slotData }) {
    super(slotData)
    this.type = type
    this.defaultValue = defaultValue
    this.min = min
    this.max = max
    this.selectOptions = selectOptions

    this.assertStructure()
  }

  serializeOptionals() {
    const optionals = {
      min: this.min,
      max: this.max,
      selectOptions: this.selectOptions,
    }

    return Object.entries(optionals).reduce((obj, [ key, value ]) => {
      // eslint-disable-next-line no-param-reassign
      if (value !== undefined) obj[key] = value
      return obj
    }, {})
  }

  serialize() {
    const dataObj = {
      type: this.type,
      ...super.serialize(),
      ...this.serializeOptionals(),
      defaultValue: this.defaultValue,
    }

    return dataObj
  }

}

module.exports = (
  JOIous(InSlot)
)
