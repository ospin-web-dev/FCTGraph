const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
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

    this.assertStructure()
  }

  serialize() {
    return {
      ...super.serialize(),
      subType: this.subType,
    }
  }

}

module.exports = (
  JOIous(IntervalOut)
)
