const faker = require('faker')
const compose = require('@choux/compose')

const FunctionalityFactory = require('functionalities/factories/FunctionalityFactory')
const FactorySeeder = require('seeders/FactorySeeder')

class FunctionalitySeeder {

  static get SEED_METHOD() { return FunctionalityFactory.new }

  static get SLOT_SEED_TYPES() {
    if (!Array.isArray(this.SLOT_SEEDS)) {
      throw new Error(`${this.name} must have .SLOT_SEEDS to use .SLOT_SEED_TYPES`)
    }

    return this.SLOT_SEEDS.map(({ type }) => type)
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
