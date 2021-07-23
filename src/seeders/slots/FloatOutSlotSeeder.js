const FloatOutSlot = require('../../slots/FloatOutSlot')
const OutSlotSeeder = require('./OutSlotSeeder')

class FloatOutSlotSeeder extends OutSlotSeeder {

  static generate(data = {}) {
    return {
      ...super.generate(data),
      dataType: FloatOutSlot.DATA_TYPE,
      ...data,
    }
  }

}

module.exports = FloatOutSlotSeeder
