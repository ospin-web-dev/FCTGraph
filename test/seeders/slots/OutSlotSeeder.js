const faker = require('faker')

const SlotFactory = require('slots/factories/SlotFactory')
const OutSlot = require('slots/OutSlot')
const SlotSeeder = require('./SlotSeeder')

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

module.exports = OutSlotSeeder
