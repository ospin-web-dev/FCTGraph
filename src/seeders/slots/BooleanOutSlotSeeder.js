const BooleanOutSlot = require('../../slots/BooleanOutSlot')
const OutSlotSeeder = require('./OutSlotSeeder')

class BooleanOutSlotSeeder extends OutSlotSeeder {

  static generate(data = {}) {
    return {
      ...super.generate(data),
      dataType: BooleanOutSlot.DATA_TYPE,
      ...data,
    }
  }

}

module.exports = BooleanOutSlotSeeder
