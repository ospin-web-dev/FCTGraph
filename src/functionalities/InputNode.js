const Joi = require('joi')

const Functionality = require('./Functionality')

class InputNode extends Functionality {

  static get TYPE() {
    return 'InputNode'
  }

  static get SCHEMA() {
    return Joi.object({
      type: Joi.string().allow(InputNode.TYPE).required(),
    }).concat(super.SCHEMA)
  }

  constructor({ type, ...functionalityData }) {
    super(functionalityData)
    this.type = type
  }

  serialize() {
    return {
      ...super.serialize(),
      type: this.type,
    }
  }

}

module.exports = InputNode
