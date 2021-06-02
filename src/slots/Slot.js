const Joi = require('joi')

const DataStream = require('../dataStreams/DataStream')

class Slot {

  /* ***************************** UNITS *************************** */
  static get UNIT_TYPES() {
    return {
      TEMPERATURE: 'temperature',
      ROTATIONAL_SPEED: 'rotationalSpeed',
      PERCENTAGE: 'percentage',
      UNITLESS: 'unitless',
    }
  }

  static get UNIT_TYPE_UNIT_OPTIONS() {
    return {
      [this.UNIT_TYPES.TEMPERATURE]: ['K', '°C', '°F'],
      [this.UNIT_TYPES.ROTATIONAL_SPEED]: ['rpm'],
      [this.UNIT_TYPES.PERCENTAGE]: ['%'],
      [this.UNIT_TYPES.UNITLESS]: ['-'],
    }
  }

  static get ALL_UNIT_VALUES() {
    return Object.values(this.UNIT_TYPE_UNIT_OPTIONS)
      .reduce((acc, opts) => ([ ...acc, ...opts ]), [])
  }
  /* **************************************************************** */

  static get DISPLAY_TYPES() {
    return {
      TEMPERATURE: 'temperature',
      SWITCH: 'switch',
      FLOW: 'flow',
    }
  }

  static get SCHEMA() {
    return Joi.object({
      name: Joi.string().required(),
      displayType: Joi.string().allow(...Object.values(Slot.DISPLAY_TYPES)).required(),
      dataStreams: Joi.array().items(DataStream.SCHEMA).required(),
      unit: Joi.string().allow(...this.ALL_UNIT_VALUES).required(), // inherited
    })
  }

  constructor({ name, displayType, dataStreams, unit }) {
    this.name = name
    this.displayType = displayType
    this.dataStreams = dataStreams
    this.unit = unit
  }

  serialize() {
    return {
      name: this.name,
      displayType: this.displayType,
      dataStreams: this.dataStreams,
      unit: this.unit,
    }
  }

}

module.exports = Slot
