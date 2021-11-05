const Joi = require('joi')

const Slot = require('./Slot')

class OutSlot extends Slot {

  static get TYPE() {
    return 'OutSlot'
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

  get isOutSlot() { return this.type === OutSlot.TYPE }

  get derivedUnit() {
    const derivedUnit = super.derivedUnit
    return derivedUnit || this.unit
  }

  _assertHasRoomForConnectionTo() { // eslint-disable-line
    // outslots are currently unlimited in the dataStreams they send out
    return true
  }

}

module.exports = OutSlot
