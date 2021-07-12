const Joi = require('joi')

const Functionality = require('./Functionality')

class Controller extends Functionality {

  static get TYPE() {
    return 'Controller'
  }

  static get SCHEMA() {
    return Joi.object({
      type: Joi.string().allow(Controller.TYPE).required(),
    }).concat(super.SCHEMA)
  }

  constructor(functionalityData) {
    super(functionalityData)
    this.type = Controller.TYPE
  }

  serialize() {
    return {
      ...super.serialize(),
      type: this.type,
    }
  }

}

module.exports = Controller
