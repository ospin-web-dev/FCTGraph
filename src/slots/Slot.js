const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const DataStream = require('../dataStreams/DataStream')

class Slot {

  static get DATA_TYPES() {
    return {
      INTEGER: 'integer',
      FLOAT: 'float',
      BOOLEAN: 'boolean',
      STRING: 'string',
    }
  }

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
      dataType: Joi.string().allow(...Object.values(Slot.DATA_TYPES)).required(),
      displayType: Joi.string().allow(...Object.values(Slot.DISPLAY_TYPES)).required(),
      dataStreams: Joi.array().items(DataStream.SCHEMA).required(),
      unit: Joi.string().required(),
    })
  }

  constructor({ name, dataType, displayType, dataStreams, unit }) {
    this.name = name
    this.dataType = dataType
    this.displayType = displayType
    this.dataStreams = dataStreams
    this.unit = unit

    this.assertStructure()
  }

  serialize() {
    return {
      name: this.name,
      dataType: this.dataType,
      displayType: this.displayType,
      dataStreams: this.dataStreams,
      unit: this.unit,
    }
  }

}

module.exports = (
  JOIous(Slot)
)
