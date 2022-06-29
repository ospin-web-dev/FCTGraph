const AnyOutSlot = require('../../slots/AnyOutSlot')
const OutSlotSeeder = require('./OutSlotSeeder')

class AnyOutSlotSeeder extends OutSlotSeeder {

  static generate(data = {}) {
    return {
      ...super.generate(data),
      dataType: AnyOutSlot.DATA_TYPE,
      ...data,
    }
  }

}

module.exports = AnyOutSlotSeeder
