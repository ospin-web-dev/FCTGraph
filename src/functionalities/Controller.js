const Functionality = require('./Functionality')

class Controller extends Functionality {

  static get TYPE() {
    return 'Controller'
  }

  constructor(functionalityData) {
    super({
      isVirtual: true,
      ...functionalityData,
    })
  }

}

module.exports = Controller
