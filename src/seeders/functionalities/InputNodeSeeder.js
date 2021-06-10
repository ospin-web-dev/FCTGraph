const FunctionalitySeeder = require('seeders/functionalities/FunctionalitySeeder')
const InputNode = require('functionalities/InputNode')

class InputNodeSeeder extends FunctionalitySeeder {

  static generate(data) {
    return {
      ...super.generate(data),
      type: InputNode.TYPE,
      ...data,
    }
  }

}

module.exports = InputNodeSeeder
