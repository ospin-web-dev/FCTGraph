const JOIous = require('../mixins/instanceMixins/JOIous')
const OutSlot = require('./OutSlot')

class FloatOutSlot extends OutSlot {

  static get DATA_TYPE() {
    return 'float'
  }

}

module.exports = (
  JOIous(FloatOutSlot)
)
