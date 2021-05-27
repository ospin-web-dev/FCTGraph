const faker = require('faker')

const Slot = require('slots/Slot.js')

module.exports = {
  name: faker.hacker.noun,
  dataType: faker.random.arrayElement(Slot.DATA_TYPES),
  displayType: faker.random.arrayElement(Slot.DISPLAY_TYPES),
  dataStreams: [],
  unit: '-',
}
