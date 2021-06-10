const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const InputNode = require('./InputNode')

class PushIn extends InputNode {

  static get SUB_TYPE() {
    return 'PushIn'
  }

  static get SCHEMA() {
    return Joi.object({
      subType: Joi.string().allow(PushIn.SUB_TYPE).required(),
    }).concat(super.SCHEMA)
  }

  constructor({ subType, ...inputNodeData }) {
    super(inputNodeData)
    this.subType = subType
  }

  serialize() {
    return {
      ...super.serialize(),
      subType: this.subType,
    }
  }

}

module.exports = (
  JOIous(PushIn)
)