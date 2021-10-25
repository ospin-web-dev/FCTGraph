const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const OutputNode = require('./OutputNode')

class IntervalOut extends OutputNode {

  static get SUB_TYPE() {
    return 'IntervalOut'
  }

  static get DEFAULT_PUBLISH_INTERVAL() { return 5000 }

  static get MIN_PUBLISH_INTERVAL() { return 1 }

  static get MAX_PUBLISH_INTERVAL() { return 1000 * 60 * 60 * 24 } // once a day

  static get SCHEMA() {
    return super.SCHEMA.concat(Joi.object({
      publishIntervalMs: Joi.number()
        .integer()
        .strict()
        .min(IntervalOut.MIN_PUBLISH_INTERVAL)
        .max(IntervalOut.MAX_PUBLISH_INTERVAL),
    }))
  }

  constructor({
    publishIntervalMs = IntervalOut.DEFAULT_PUBLISH_INTERVAL,
    ...functionalityData
  }) {
    super(functionalityData)
    this.publishIntervalMs = publishIntervalMs
  }

  serialize() {
    return {
      ...super.serialize(),
      publishIntervalMs: this.publishIntervalMs,
    }
  }

}

module.exports = (
  JOIous(IntervalOut)
)
