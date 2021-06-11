const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const RegexUtils = require('../utils/RegexUtils')

class DataStream {

  static get SCHEMA() {
    return Joi.object({
      id: Joi.string().pattern(RegexUtils.UUIDV4).required(),
      sourceFctId: Joi.string().pattern(RegexUtils.UUIDV4).required(),
      sourceSlotName: Joi.string().required(),
      sinkFctId: Joi.string().pattern(RegexUtils.UUIDV4).required(),
      sinkSlotName: Joi.string().required(),
      averagingWindowSize: Joi.number().integer().strict(),
    })
  }

  constructor({
    id,
    sourceFctId,
    sourceSlotName,
    sinkFctId,
    sinkSlotName,
    averagingWindowSize,
  }) {
    this.id = id
    this.sourceFctId = sourceFctId
    this.sourceSlotName = sourceSlotName
    this.sinkFctId = sinkFctId
    this.sinkSlotName = sinkSlotName
    this.averagingWindowSize = averagingWindowSize
  }

  serialize() {
    return {
      id: this.id,
      sourceFctId: this.sourceFctId,
      sourceSlotName: this.sourceSlotName,
      sinkFctId: this.sinkFctId,
      sinkSlotName: this.sinkSlotName,
      averagingWindowSize: this.averagingWindowSize,
    }
  }

}

module.exports = (
  JOIous(DataStream)
)
