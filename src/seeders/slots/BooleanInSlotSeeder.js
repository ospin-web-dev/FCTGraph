
const BooleanInSlot = require('../../slots/BooleanInSlot')
const InSlotSeeder = require('./InSlotSeeder')
const RandomDataGenerator = require('../../utils/RandomDataGenerator')

class BooleanInSlotSeeder extends InSlotSeeder {

  static generate(data = {}) {
    const slotData = super.generate(data)

    return {
      ...slotData,
      defaultValue: RandomDataGenerator.boolean(),
      dataType: BooleanInSlot.DATA_TYPE,
      ...data,
    }
  }

}

module.exports = BooleanInSlotSeeder
