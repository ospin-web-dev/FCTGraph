const faker = require('faker')
const compose = require('@choux/compose')

const FactorySeeder = require('./FactorySeeder')
const SlotSeeder = require('./SlotSeeder')
const FunctionalityFactory = require('../../src/functionalities/factories/FunctionalityFactory')
// const Functionality = require('../../src/functionalities/Functionality')

class FunctionalitySeeder {

  static get Factory() { return FunctionalityFactory }

  static generate(data) {
    return {
      id: faker.datatype.uuid(),
      name: faker.hacker.noun(),
      type: faker.random.arrayElement(FunctionalityFactory.SUPPORTED_TYPES),
      subType: faker.random.arrayElement(FunctionalityFactory.SUPPORTED_SUB_TYPES),
      slots: SlotSeeder.generateN(3),
      ...data,
    }
  }

}

module.exports = compose([ FactorySeeder ])(FunctionalitySeeder)
