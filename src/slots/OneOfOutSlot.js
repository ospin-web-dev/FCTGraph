const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const OutSlot = require('./OutSlot')

class OneOfOutSlot extends OutSlot {

  static get DATA_TYPE() {
    return 'oneOf'
  }

}

module.exports = (
  JOIous(OneOfOutSlot)
)
