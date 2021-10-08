const Functionality = require('./Functionality')

class Actuator extends Functionality {

  static get TYPE() {
    return 'Actuator'
  }

  constructor(functionalityData) {
    super({
      isVirtual: false,
      ...functionalityData,
    })
  }

}

module.exports = Actuator
