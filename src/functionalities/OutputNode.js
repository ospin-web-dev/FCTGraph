const Joi = require('joi')

const Functionality = require('./Functionality')

class OutputNode extends Functionality {

  static get TYPE() {
    return 'OutputNode'
  }

  static get SCHEMA() {
    return Joi.object({
      type: Joi.string().allow(OutputNode.TYPE).required(),
    }).concat(super.SCHEMA)
  }

  constructor(functionalityData) {
    super(functionalityData)
    this.type = OutputNode.TYPE
  }

  serialize() {
    return {
      ...super.serialize(),
      type: this.type,
    }
  }

}

module.exports = OutputNode
