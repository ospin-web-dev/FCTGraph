const faker = require('faker')
const compose = require('@choux/compose')

const FactorySeeder = require('./FactorySeeder')
const SlotSeeder = require('./SlotSeeder')
const FunctionalityFactory = require('../../src/functionalities/factories/FunctionalityFactory')
// const Functionality = require('../../src/functionalities/Functionality')

class FunctionalitySeeder {

  static get Factory() { return FunctionalityFactory }

  // get the factory's supported classes
  //   map their class.SUB_TYPE to class.prototype.TYPE

  static generate(data) {
    const RandomSubClass = faker.random.arrayElement(FunctionalityFactory.SUPPORTED_CLASSES)

    return {
      id: faker.datatype.uuid(),
      name: faker.hacker.noun(),
      type: Object.getPrototypeOf(RandomSubClass).TYPE,
      subType: RandomSubClass.SUB_TYPE,
      slots: SlotSeeder.generateN(3),
      ...data,
    }
  }

}

module.exports = compose([ FactorySeeder ])(FunctionalitySeeder)
