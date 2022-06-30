const AnyInSlot = require('../../slots/AnyInSlot')
const InSlotSeeder = require('./InSlotSeeder')

class AnyInSlotSeeder extends InSlotSeeder {

  static generate(data = {}) {
    const slotData = super.generate(data)

    return {
      ...slotData,
      dataType: AnyInSlot.DATA_TYPE,
      ...data,
    }
  }

}

module.exports = AnyInSlotSeeder
