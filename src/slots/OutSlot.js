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
      type: Joi.string().allow(this.TYPE).required(),
      calibrations: OutSlot.CALIBRATIONS_SCHEMA,
    }).concat(super.SCHEMA)
  }

  get isOutSlot() { return true } // eslint-disable-line

  get derivedUnit() {
    const derivedUnit = super.derivedUnit
    return derivedUnit || this.unit
  }

  get reporterFctId() {
    const reporterFct = this.connectedFunctionalities
      .find(({ type, destination }) => (
        type === 'OutputNode' && destination.name === 'ospin-webapp'))
    return reporterFct ? reporterFct.id : null
  }

  _assertHasRoomForConnectionTo() { // eslint-disable-line
    // outslots are currently unlimited in the dataStreams they send out
    return true
  }


}

module.exports = OutSlot
