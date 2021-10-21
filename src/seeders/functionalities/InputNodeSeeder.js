const FunctionalitySeeder = require('./FunctionalitySeeder')
const InputNode = require('../../functionalities/InputNode')

class InputNodeSeeder extends FunctionalitySeeder {

  static generate(data) {
    return {
      ...super.generate(data),
      type: InputNode.TYPE,
      source: InputNode.DEFAULT_SOURCE,
      ...data,
    }
  }

}

module.exports = InputNodeSeeder
