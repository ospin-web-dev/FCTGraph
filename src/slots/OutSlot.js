const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const Slot = require('./Slot')

class OutSlot extends Slot {

  static get TYPE() {
    return 'OutSlot'
  }

  static get DATA_TYPES() {
    return {
      INTEGER: 'integer',
      FLOAT: 'float',
      BOOLEAN: 'boolean',
      ONE_OF: 'oneOf',
    }
  }

  /* *******************************************************************
   * CALIBRATION
   * **************************************************************** */
  static get SUPPORTS_CALIBRATION() { return true }

  static get OFFSET_SLOPE_CALIBRATON_TYPE() { return 'OFFSET_SLOPE' }

  static get SUPPORTED_CALIBRATION_TYPES() {
    return [OutSlot.OFFSET_SLOPE_CALIBRATON_TYPE]
  }

  static get CALIBRATIONS_SCHEMA() {
    return Joi.array().items(Joi.object({
      type: Joi.string().allow(OutSlot.OFFSET_SLOPE_CALIBRATON_TYPE).required(),
      params: Joi.object({
        offset: Joi.string().allow('float').required(),
        slope: Joi.string().allow('float').required(),
      }),
    }))
  }
  /* **************************************************************** */

  static get SCHEMA() {
    return Joi.object({
      type: Joi.string().allow(OutSlot.TYPE).required(),
      dataType: Joi.string().allow(...Object.values(OutSlot.DATA_TYPES)).required(),
      calibrations: OutSlot.CALIBRATIONS_SCHEMA,
    }).concat(super.SCHEMA)
  }

  constructor({ type, dataType, ...slotData }) {
    super(slotData)
    this.type = OutSlot.TYPE
    this.dataType = dataType
  }

  serialize() {
    return {
      ...super.serialize(),
      type: this.type,
      dataType: this.dataType,
    }
  }

}

module.exports = (
  JOIous(OutSlot)
)
