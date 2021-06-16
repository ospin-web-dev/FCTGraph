const FunctionalitySeeder = require('./FunctionalitySeeder')
const Controller = require('../../functionalities/Controller')

class ControllerSeeder extends FunctionalitySeeder {

  static generate(data) {
    return {
      ...super.generate(data),
      type: Controller.TYPE,
      ...data,
    }
  }

}

module.exports = ControllerSeeder
