const faker = require('faker')

const BooleanInSlot = require('../../slots/BooleanInSlot')
const InSlotSeeder = require('./InSlotSeeder')

class BooleanInSlotSeeder extends InSlotSeeder {

  static generate(data = {}) {
    const slotData = super.generate(data)

    return {
      ...slotData,
      defaultValue: faker.datatype.boolean(),
      dataType: BooleanInSlot.DATA_TYPE,
      ...data,
    }
  }

}

module.exports = BooleanInSlotSeeder
