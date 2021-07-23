const InSlot = require('../../slots/InSlot')
const SlotSeeder = require('./SlotSeeder')

class InSlotSeeder extends SlotSeeder {

  static generate(data = {}) {
    return {
      ...super.generate(data),
      type: InSlot.TYPE,
      ...data,
    }
  }

}

module.exports = InSlotSeeder
