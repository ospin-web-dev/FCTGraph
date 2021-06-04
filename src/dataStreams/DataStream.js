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

  serialize() {
    throw new Error('TODO this should also probably have types, understanding there is an averaging window size thing going on. try to convince denis')
  }

}

module.exports = (
  JOIous(DataStream)
)
