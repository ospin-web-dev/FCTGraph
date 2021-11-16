const JOIous = require('../mixins/instanceMixins/JOIous')
const OutSlot = require('./OutSlot')

class IntegerOutSlot extends OutSlot {

  static get DATA_TYPE() {
    return 'integer'
  }

}

module.exports = (
  JOIous(IntegerOutSlot)
)
