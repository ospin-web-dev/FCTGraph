const Functionality = require('./Functionality')

class Sensor extends Functionality {

  static get TYPE() {
    return 'Sensor'
  }

  constructor(functionalityData) {
    super({
      isVirtual: false,
      ...functionalityData,
    })
  }

}

module.exports = Sensor
