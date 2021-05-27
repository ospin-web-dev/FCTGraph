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
      min: Joi.number().strict(),
      max: Joi.number().strict(),
      defaultValue: Joi.alternatives().try(Joi.string(), Joi.number(), Joi.boolean()).required(),
    }).concat(super.SCHEMA)
  }

  constructor({ type, min, max, defaultValue, ...slotData }) {
    super(slotData)
    this.type = type
    this.min = min
    this.max = max
    this.defaultValue = defaultValue

    this.assertStructure()
  }

  serialize() {
    return {
      ...super.serialize(),
      type: this.type,
      min: this.min,
      max: this.max,
      defaultValue: this.defaultValue,
    }
  }

}

module.exports = (
  JOIous(InSlot)
)
