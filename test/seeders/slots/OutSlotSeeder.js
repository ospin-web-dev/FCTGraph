const faker = require('faker')
const compose = require('@choux/compose')

const SlotFactory = require('slots/factories/SlotFactory')
const OutSlot = require('slots/OutSlot')
const SlotSeeder = require('./SlotSeeder')
const FactorySeeder = require('../FactorySeeder')

class OutSlotSeeder extends SlotSeeder {

  static get Factory() { return SlotFactory }

  static generate(data = {}) {
    return {
      ...super.generate(data),
      type: 'OutSlot',
      dataType: faker.random.arrayElement(Object.values(OutSlot.DATA_TYPES)),
      ...data,
    }
  }

}

module.exports = compose([ FactorySeeder ])(OutSlotSeeder)
