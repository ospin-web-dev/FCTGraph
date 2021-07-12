const SlotSeeder = require('./SlotSeeder')

class InSlotSeeder extends SlotSeeder {

  static generate(data = {}) {
    const slotData = super.generate(data)

    return {
      ...slotData,
      type: 'InSlot',
    }
  }

}

module.exports = InSlotSeeder
