const faker = require('faker')

const FactorySeeder = require('./FactorySeeder')
const SlotFactory = require('../../src/slots/SlotFactory')
const Slot = require('../../src/slots/Slot')

class SlotSeeder extends FactorySeeder {

  // use inherited this.seedOne for an instance
  static generateOne(data) {
    return {
      name: faker.hacker.noun,
      dataType: faker.random.arrayElement(Slot.DATA_TYPES),
      displayType: faker.random.arrayElement(Slot.DISPLAY_TYPES),
      dataStreams: [],
      unit: faker.random.arrayElement(Slot.ALL_UNITS),
      ...data,
    }
  }

}

SlotSeeder.Factory = SlotFactory

module.exports = SlotSeeder
