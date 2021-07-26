const ArrayUtils = require('@choux/array-utils')
const FunctionalitySeeder = require('./FunctionalitySeeder')
const OutputNode = require('../../functionalities/OutputNode')

class OutputNodeSeeder extends FunctionalitySeeder {

  static generate(data) {
    return {
      ...super.generate(data),
      type: OutputNode.TYPE,
      destination: ArrayUtils.sample(Object.values(OutputNode.VALID_DESTINATIONS)),
      ...data,
    }
  }

}

module.exports = OutputNodeSeeder
