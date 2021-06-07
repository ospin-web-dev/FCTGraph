const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const RegexUtils = require('../utils/RegexUtils')

class DataStream {

  static get SCHEMA() {
    return Joi.object({
      id: Joi.string().pattern(RegexUtils.UUIDV4).required(),
      sourceSlotName: Joi.string().required(),
      sinkSlotName: Joi.string().required(),
      averagingWindowSize: Joi.number().integer().strict(),
    })
  }

  constructor({ id, sourceSlotName, sinkSlotName, averagingWindowSize }) {
    this.id = id
    this.sourceSlotName = sourceSlotName
    this.sinkSlotName = sinkSlotName
    this.averagingWindowSize = averagingWindowSize
  }

  serialize() {
    return {
      id: this.id,
      sourceSlotName: this.sourceSlotName,
      sinkSlotName: this.sinkSlotName,
      averagingWindowSize: this.averagingWindowSize,
    }
  }

}

module.exports = (
  JOIous(DataStream)
)
