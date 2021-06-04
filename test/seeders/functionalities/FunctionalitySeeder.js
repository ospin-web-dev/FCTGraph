const faker = require('faker')
const compose = require('@choux/compose')

const FunctionalityFactory = require('functionalities/factories/FunctionalityFactory')
const FactorySeeder = require('test/seeders/FactorySeeder')

class FunctionalitySeeder {

  static get Factory() { return FunctionalityFactory }

  static generate(data) {
    return {
      id: faker.datatype.uuid(),
      name: faker.hacker.noun(),
      slots: [],
      ...data,
    }
  }

}

module.exports = compose([ FactorySeeder ])(FunctionalitySeeder)
