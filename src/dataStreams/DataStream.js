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
      averagingWindowSize: Joi
        .number()
        .integer()
        .min(0)
        .strict(),
    })
  }

  constructor({
    id,
    sourceSlot,
    sinkSlot,
    averagingWindowSize = 0,
  }) {
    this.id = id
    this.sourceSlot = sourceSlot
    this.sinkSlot = sinkSlot
    this.averagingWindowSize = averagingWindowSize
  }

  get sourceFctId() { return this.sourceSlot.functionalityId }

  get sinkFctId() { return this.sinkSlot.functionalityId }

  serialize() {
    return {
      id: this.id,
      sourceFctId: this.sourceFctId,
      sourceSlotName: this.sourceSlot.name,
      sinkFctId: this.sinkFctId,
      sinkSlotName: this.sinkSlot.name,
      averagingWindowSize: this.averagingWindowSize,
    }
  }

  isSourceSlot(slot) { return this.sourceSlot === slot }

  isSinkSlot(slot) { return this.sinkSlot === slot }

  slotIsSourceOrSink(slot) {
    return (this.isSourceSlot(slot) || this.isSinkSlot(slot))
  }

  _assertSlotIsSourceOrSink(slot) {
    if (this.slotIsSourceOrSink(slot)) { return true }

    throw new Error(
      `Datastream:\n${this}\nhas neither source nor sink matching\nslotName: ${slot.name}\nslotFctId: ${slot.functionalityId}`,
    )
  }

  getOpposingSlotTo(slot) {
    this._assertSlotIsSourceOrSink(slot)

    return this.isSourceSlot(slot) ? this.sinkSlot : this.sourceSlot
  }

  isConnectionBetweenTwoSlots(slotA, slotB) {
    const slotAIsPresent = this.slotIsSourceOrSink(slotA)
    if (!slotAIsPresent) return false

    return this.getOpposingSlotTo(slotA) === slotB
  }

}

module.exports = (
  JOIous(DataStream)
)
