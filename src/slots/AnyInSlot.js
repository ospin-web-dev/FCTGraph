const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const InSlot = require('./InSlot')
const SlotConnectionError = require('./SlotConnectionError')

class AnyInSlot extends InSlot {

  static get DATA_TYPE() {
    return super.ANY_DATA_TYPE
  }

  static get SCHEMA() {
    return super.SCHEMA.concat(Joi.object({
      dataType: Joi.string().allow(this.DATA_TYPE).required(),
    }))
  }

  connectTo(otherSlot, dataStreamData) {
    /* this is a workaround that allows setting the default values
     * for the dataStreams based in the connected dataType
     * for the "any" dataType
     */
    if (otherSlot.type === InSlot.TYPE) {
      throw new SlotConnectionError(this, otherSlot, 'must have complimentary types')
    }

    if (otherSlot.dataType === AnyInSlot.DATA_TYPE) {
      /* prevent infinite loop when connecting to an AnyInSlot */
      const extendedDataStreamData = {
        averagingWindowSize: 1,
        ...dataStreamData,
      }
      return super.connectTo(otherSlot, extendedDataStreamData)
    }

    return otherSlot.connectTo(this, dataStreamData)
  }

}

module.exports = JOIous(AnyInSlot)
