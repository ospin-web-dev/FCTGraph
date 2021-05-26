const Joi = require('joi')

const Functionality = require('./functionalities/Functionality')

class FCTGraph {

  static get SCHEMA() {
    return Joi.object({
      functionalities: Joi.array().items(Functionality.SCHEMA).default([]),
    })
  }

  constructor({
    functionalities,
  }) {
    this.functionalities = functionalities

    this.assertStructure()
  }

  assertStructure() {
    FCT.schema({
      id: this.id,
      functionalities: this.functionalities,

    })

  }

}

module.exports = FCTGraph
