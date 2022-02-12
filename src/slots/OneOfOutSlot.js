const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const OutSlot = require('./OutSlot')

class OneOfOutSlot extends OutSlot {

  static get DATA_TYPE() {
    return 'oneOf'
  }

  static get SCHEMA() {
    return super.SCHEMA.concat(Joi.object({
      dataType: Joi.string().allow(this.DATA_TYPE).required(),
    }))
  }

}

module.exports = (
  JOIous(OneOfOutSlot)
)
