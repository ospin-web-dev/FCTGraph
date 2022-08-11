const ArrayUtils = require('@choux/array-utils')
const FunctionalitySeeder = require('./FunctionalitySeeder')
const OutputNode = require('../../functionalities/OutputNode')

class OutputNodeSeeder extends FunctionalitySeeder {

  static generate(data) {
    return {
      ...super.generate(data),
      type: OutputNode.TYPE,
      ...data,
    }
  }

}

module.exports = OutputNodeSeeder
