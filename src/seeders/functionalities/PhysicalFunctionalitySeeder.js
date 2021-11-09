const FunctionalitySeeder = require('./FunctionalitySeeder')

class PhysicalFunctionalitySeeder extends FunctionalitySeeder {

  static generate(data) {
    return {
      ...super.generate(data),
      ...data,
      ports: [],
      isVirtual: false,
    }
  }

}

module.exports = PhysicalFunctionalitySeeder
