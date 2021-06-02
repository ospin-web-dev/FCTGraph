const Joi = require('joi')

const OutputNode = require('./OutputNode')

class PushOut extends OutputNode {

  static get SUB_TYPE() {
    return 'PushOut'
  }

  static get SCHEMA() {
    return Joi.object({
      subType: Joi.string().allow(PushOut.SUB_TYPE).required(),
    }).concat(super.SCHEMA)
  }

  constructor({ subType, ...outputNodeData }) {
    super(outputNodeData)
    this.subType = subType
  }

  serialize() {
    return {
      ...super.serialize(),
      subType: this.subType,
    }
  }

}

module.exports = PushOut
