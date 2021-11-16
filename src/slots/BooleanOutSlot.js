const JOIous = require('../mixins/instanceMixins/JOIous')
const OutSlot = require('./OutSlot')

class BooleanOutSlot extends OutSlot {

  static get DATA_TYPE() {
    return 'boolean'
  }

}

module.exports = (
  JOIous(BooleanOutSlot)
)
