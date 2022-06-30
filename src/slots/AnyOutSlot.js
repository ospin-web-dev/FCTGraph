const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const OutSlot = require('./OutSlot')
const SlotConnectionError = require('./SlotConnectionError')

class AnyOutSlot extends OutSlot {

  static get DATA_TYPE() {
    return super.ANY_DATA_TYPE
  }

  static get SCHEMA() {
    return super.SCHEMA.concat(Joi.object({
      dataType: Joi.string().allow(this.DATA_TYPE).required(),
    }))
  }

  connectTo(otherSlot, dataStreamData) {
    /* datastream default values (e.g. averagingWindowSize) depend on the dataType
     * of the slot; when connectTo is called on the "any" dataType slot, we simply
     * check if the other slot is not of dataType "any" and if so, we simply call connnectTo
     * on the other slot, which then will set the proper default values;
     *
     * the default case prevents an infinite loop when connecting two "any" slots
     */
    if (otherSlot.dataType !== AnyOutSlot.DATA_TYPE) {
      return otherSlot.connectTo(this, dataStreamData)
    }

    const extendedDataStreamData = {
      averagingWindowSize: 1,
      ...dataStreamData,
    }
    return super.connectTo(otherSlot, extendedDataStreamData)
  }

}

module.exports = JOIous(AnyOutSlot)
