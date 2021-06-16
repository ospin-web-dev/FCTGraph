const faker = require('faker')
const compose = require('@choux/compose')
const { v4: uuidv4 } = require('uuid')

const FactorySeeder = require('../FactorySeeder')
const SlotFactory = require('../../slots/factories/SlotFactory')
const Slot = require('../../slots/Slot')

class SlotSeeder {

  static get SEED_METHOD() { return SlotFactory.new }

  static stubOwningFct(slot) {
    // eslint-disable-next-line
    slot.functionalityId = uuidv4()
    return slot
  }

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
