const faker = require('faker')
const compose = require('@choux/compose')

const FunctionalityFactory = require('../../functionalities/factories/FunctionalityFactory')
const FactorySeeder = require('../FactorySeeder')

class FunctionalitySeeder {

  static get SEED_METHOD() { return FunctionalityFactory.new }

  static get SLOT_SEED_TYPES() {
    if (!Array.isArray(this.generateSlots())) {
      throw new Error(`${this.name} must have a .generateSlots method to use .SLOT_SEED_TYPES`)
    }

    return this.generateSlots().map(({ type }) => type)
  }

  static generate(data) {
    return {
      id: faker.datatype.uuid(),
      name: faker.hacker.noun(),
      ...data,
    }
  }

}

module.exports = compose([ FactorySeeder ])(FunctionalitySeeder)
