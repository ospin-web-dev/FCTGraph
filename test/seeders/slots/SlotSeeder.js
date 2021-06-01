const faker = require('faker')

const Slot = require('slots/Slot')

class SlotSeeder {

  static generate(data = {}) {
    return {
      name: faker.animal.lion(),
      dataType: faker.random.arrayElement(Object.values(Slot.DATA_TYPES)),
      displayType: faker.random.arrayElement(Object.values(Slot.DISPLAY_TYPES)),
      dataStreams: [],
      unit: faker.random.arrayElement(Slot.ALL_UNIT_VALUES),
      ...data,
    }
  }

}

module.exports = SlotSeeder
