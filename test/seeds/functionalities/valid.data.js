const faker = require('faker')

const Functionality = require('functionalities/Functionality')

module.exports = {
  id: faker.random.uuid(),
  name: faker.random.arrayElement(Slot.DATA_TYPES),
  type: faker.random.arrayElement(Slot.DISPLAY_TYPES),
  subType: 'sensor',
  slots: [],
}
