const Joi = require('joi')

const JOIous = require('mixins/instanceMixins/JOIous')
const Slot = require('./Slot')

class OutSlot extends Slot {

  static get TYPE() {
    return 'OutSlot'
  }

  static get DATA_TYPES() {
    return {
      INTEGER: 'integer',
      FLOAT: 'float',
    }
  }

  static get SCHEMA() {
    return Joi.object({
      type: Joi.string().allow(OutSlot.TYPE).required(),
      dataType: Joi.string().allow(...Object.values(OutSlot.DATA_TYPES)).required(),
    }).concat(super.SCHEMA)
  }

  constructor({ type, dataType, ...slotData }) {
    super(slotData)
    this.type = type
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
