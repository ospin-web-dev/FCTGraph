const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const InSlot = require('./InSlot')

class BooleanInSlot extends InSlot {

  static get DATA_TYPE() {
    return 'boolean'
  }

  static get SCHEMA() {
    return super.SCHEMA.concat(Joi.object({
      defaultValue: Joi.boolean().allow(null),
      dataType: Joi.string().allow(this.DATA_TYPE).required(),
    }))
  }

  constructor({ defaultValue = null, ...slotData }) {
    super(slotData)
    this.defaultValue = defaultValue
  }

  serialize() {
    const dataObj = {
      defaultValue: this.defaultValue,
      ...super.serialize(),
    }

    return dataObj
  }

  _createDataStreamTo(otherSlot, dataStreamData) {
    const extendedDataStreamData = {
      averagingWindowSize: 1,
      ...dataStreamData,
    }
    return super._createDataStreamTo(otherSlot, extendedDataStreamData)
  }

}

module.exports = JOIous(BooleanInSlot)
