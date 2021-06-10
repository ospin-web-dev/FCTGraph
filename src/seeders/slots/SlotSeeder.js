const faker = require('faker')
const compose = require('@choux/compose')

const FactorySeeder = require('seeders/FactorySeeder')
const SlotFactory = require('slots/factories/SlotFactory')
const Slot = require('slots/Slot')

class SlotSeeder {

  static get SEED_METHOD() { return SlotFactory.new }

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
