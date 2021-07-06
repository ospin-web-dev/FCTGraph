const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const Slot = require('./Slot')

class InSlot extends Slot {

  static get TYPE() {
    return 'InSlot'
  }

  static get DATA_TYPES() {
    return {
      INTEGER: 'integer',
      FLOAT: 'float',
      BOOLEAN: 'boolean',
      ONE_OF: 'oneOf',
    }
  }

  static SERIALIZE_OPTIONAL_DATA(inSlot) {
    const optionals = {
      min: inSlot.min,
      max: inSlot.max,
      selectOptions: inSlot.selectOptions,
    }

    return Object.entries(optionals).reduce((obj, [ key, value ]) => {
      // eslint-disable-next-line no-param-reassign
      if (value !== undefined) obj[key] = value
      return obj
    }, {})
  }

  static get SCHEMA() {
    return Joi.object({
      type: Joi.string().allow(InSlot.TYPE).required(),
      dataType: Joi.string().allow(...Object.values(InSlot.DATA_TYPES)).required(),
      tareable: Joi.boolean().required(),
      min: Joi.number().strict()
        .when('dataType', [
          {
            is: InSlot.DATA_TYPES.INTEGER,
            then: Joi.number().integer().default(null).allow(null),
          },
          {
            is: InSlot.DATA_TYPES.FLOAT,
            then: Joi.number().default(null).allow(null),
            otherwise: Joi.forbidden(),
          },
        ]),
      max: Joi.number().strict()
        .when('min', {
          is: Joi.number().strict(),
          then: Joi.number().min(Joi.ref('min')).optional(),
        })
        .when('dataType', [
          {
            is: InSlot.DATA_TYPES.INTEGER,
            then: Joi.number().integer().default(null).allow(null),
          },
          {
            is: InSlot.DATA_TYPES.FLOAT,
            then: Joi.number().default(null).allow(null),
            otherwise: Joi.forbidden(),
          },
        ]),
      defaultValue: Joi.any()
        .when('dataType', {
          is: InSlot.DATA_TYPES.INTEGER,
          then: Joi
            .when('min', {
              is: Joi.number().strict(),
              then: Joi.number().integer().min(Joi.ref('min')),
            })
            .when('max', {
              is: Joi.number().strict(),
              then: Joi.number().integer().max(Joi.ref('max')),
            }),
        })
        .when('dataType', {
          is: InSlot.DATA_TYPES.FLOAT,
          then: Joi
            .when('min', {
              is: Joi.number().strict(),
              then: Joi.number().min(Joi.ref('min')),
            })
            .when('max', {
              is: Joi.number().strict(),
              then: Joi.number().max(Joi.ref('max')),
            }),
        })
        .when('dataType', {
          is: InSlot.DATA_TYPES.BOOLEAN,
          then: Joi.boolean().optional(),
        })
        .when('dataType', {
          is: InSlot.DATA_TYPES.ONE_OF,
          then: Joi.any().valid(Joi.in('selectOptions')),
        })
        .allow(null)
        .default(null),
      selectOptions: Joi.array()
        .when('dataType', {
          is: InSlot.DATA_TYPES.ONE_OF,
          then: Joi.required(),
          otherwise: Joi.forbidden(),
        }),
    }).concat(super.SCHEMA)
  }

  constructor({
    type,
    dataType,
    tareable,
    min,
    max,
    defaultValue,
    selectOptions,
    ...slotData
  }) {
    super(slotData)
    this.type = type
    this.dataType = dataType
    this.tareable = tareable || false
    this.defaultValue = defaultValue === undefined ? null : defaultValue
    this.min = min
    this.max = max
    this.selectOptions = selectOptions
  }

  serializeOptionals() {
    // class method useful for seeding
    // which is why the instance is delegating up
    return InSlot.SERIALIZE_OPTIONAL_DATA(this)
  }

  serialize() {
    const dataObj = {
      type: this.type,
      dataType: this.dataType,
      tareable: this.tareable,
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
