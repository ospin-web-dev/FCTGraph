const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const OutSlot = require('./OutSlot')

class BooleanOutSlot extends OutSlot {

  static get DATA_TYPE() {
    return 'boolean'
  }

  static get SCHEMA() {
    return super.SCHEMA.concat(Joi.object({
      dataType: Joi.string().allow(this.DATA_TYPE).required(),
    }))
  }

  _createDataStreamTo(otherSlot, dataStreamData) {
    const extendedDataStreamData = {
      averagingWindowSize: 1,
      ...dataStreamData,
    }
    return super._createDataStreamTo(otherSlot, extendedDataStreamData)
  }

}

module.exports = (
  JOIous(BooleanOutSlot)
)
