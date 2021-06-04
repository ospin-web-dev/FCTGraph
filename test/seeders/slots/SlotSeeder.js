const faker = require('faker')
const compose = require('@choux/compose')

const Slot = require('slots/Slot')
const FactorySeeder = require('test/seeders/FactorySeeder')

class SlotSeeder {

  static generate(data = {}) {
    return {
      name: faker.animal.lion(),
      displayType: faker.random.arrayElement(Object.values(Slot.DISPLAY_TYPES)),
      dataStreams: [],
      unit: faker.random.arrayElement(Slot.ALL_UNIT_VALUES),
      ...data,
    }
  }

}

module.exports = compose([ FactorySeeder ])(SlotSeeder)
