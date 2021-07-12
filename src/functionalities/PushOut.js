const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
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

  constructor(outputNodeData) {
    super(outputNodeData)
    this.subType = PushOut.SUB_TYPE
  }

  serialize() {
    return {
      ...super.serialize(),
      subType: this.subType,
    }
  }

}

module.exports = (
  JOIous(PushOut)
)
