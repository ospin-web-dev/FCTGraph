const faker = require('faker')

const BooleanInSlot = require('../../slots/BooleanInSlot')
const InSlotSeeder = require('./InSlotSeeder')

class BooleanInSlotSeeder extends InSlotSeeder {

  static generateDefaultValue({ defaultValue }) {
    if (defaultValue !== null && defaultValue !== undefined) {
      return defaultValue
    }
    return faker.datatype.boolean()
  }

  static generate(data = {}) {
    const slotData = super.generate(data)
    slotData.dataType = BooleanInSlot.DATA_TYPE

    return {
      ...slotData,
      defaultValue: BooleanInSlotSeeder.generateDefaultValue(slotData),
    }
  }

}

module.exports = BooleanInSlotSeeder
