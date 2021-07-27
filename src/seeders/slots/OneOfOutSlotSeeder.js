const OneOfOutSlot = require('../../slots/OneOfOutSlot')
const OutSlotSeeder = require('./OutSlotSeeder')

class OneOfOutSlotSeeder extends OutSlotSeeder {

  static generate(data = {}) {
    return {
      ...super.generate(data),
      dataType: OneOfOutSlot.DATA_TYPE,
      ...data,
    }
  }

}

module.exports = OneOfOutSlotSeeder
