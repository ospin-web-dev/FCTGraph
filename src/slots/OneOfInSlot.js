const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const InSlot = require('./InSlot')

class OneOfInSlot extends InSlot {

  static get DATA_TYPE() {
    return 'oneOf'
  }

  static get SCHEMA() {
    return super.SCHEMA.concat(Joi.object({
      defaultValue: Joi.any().valid(Joi.in('selectOptions')).allow(null),
      selectOptions: Joi.array(),
      dataType: Joi.string().allow(this.DATA_TYPE).required(),
    }))
  }

  constructor({ defaultValue = null, selectOptions = [], ...slotData }) {
    super(slotData)
    this.defaultValue = defaultValue
    this.selectOptions = selectOptions
  }

  _createDataStreamTo(otherSlot, dataStreamData) {
    const extendedDataStreamData = {
      averagingWindowSize: 1,
      ...dataStreamData,
    }
    return super._createDataStreamTo(otherSlot, extendedDataStreamData)
  }

  serialize() {
    const dataObj = {
      defaultValue: this.defaultValue,
      selectOptions: this.selectOptions,
      ...super.serialize(),
    }

    return dataObj
  }

}

module.exports = JOIous(OneOfInSlot)
