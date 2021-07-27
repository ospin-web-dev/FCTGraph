const IntegerOutSlot = require('../../slots/IntegerOutSlot')
const OutSlotSeeder = require('./OutSlotSeeder')

class IntegerOutSlotSeeder extends OutSlotSeeder {

  static generate(data = {}) {
    return {
      ...super.generate(data),
      dataType: IntegerOutSlot.DATA_TYPE,
      ...data,
    }
  }

}

module.exports = IntegerOutSlotSeeder
