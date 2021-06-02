const Joi = require('joi')

const OutputNode = require('./OutputNode')

class IntervalOut extends OutputNode {

  static get SUB_TYPE() {
    return 'IntervalOut'
  }

  static get SCHEMA() {
    return Joi.object({
      subType: Joi.string().allow(IntervalOut.SUB_TYPE).required(),
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

module.exports = IntervalOut
