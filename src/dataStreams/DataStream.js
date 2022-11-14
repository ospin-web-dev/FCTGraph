const Joi = require('joi')
const RegexUtils = require('../utils/RegexUtils')

const SCHEMA = Joi.object({
  id: Joi.string().pattern(RegexUtils.UUIDV4).required(),
  sourceFctId: Joi.string().pattern(RegexUtils.UUIDV4).required(),
  sourceSlotName: Joi.string().required(),
  sinkFctId: Joi.string().pattern(RegexUtils.UUIDV4).required(),
  sinkSlotName: Joi.string().required(),
  averagingWindowSize: Joi
    .number()
    .integer()
    .min(0)
    .strict()
    .default(0),
})

const create = data => (
  Joi.attempt(data, SCHEMA)
)

const connectsToFctSlot = (dataStream, fctId, slotName) => (
  (dataStream.sourceFctId === fctId && dataStream.sourceSlotName === slotName)
    || (dataStream.sinkFctId === fctId && dataStream.sinkSlotName === slotName)
)

const connectsFct = (dataStream, fctId) => (
  dataStream.sourceFctId === fctId || dataStream.sinkFctId === fctId
)

module.exports = {
  SCHEMA,
  create,
  connectsFct,
  connectsToFctSlot,
}
