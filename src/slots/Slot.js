const Joi = require('joi')
const { v4: uuidv4 } = require('uuid')

const DataStream = require('../dataStreams/DataStream')
const { publicSuccessRes, publicErrorRes } = require('../utils/publicResponses')
const SlotConnectionError = require('./SlotConnectionError')

class Slot {

  static get SUPPORTS_CALIBRATION() { return false }

  /* *******************************************************************
   * UNITS
   * **************************************************************** */
  static get UNIT_TYPES() {
    return {
      TEMPERATURE: 'temperature',
      ROTATIONAL_SPEED: 'rotationalSpeed',
      PERCENTAGE: 'percentage',
      UNITLESS: 'unitless',
    }
  }

  static get UNIT_TYPE_UNIT_OPTIONS() {
    return {
      [Slot.UNIT_TYPES.TEMPERATURE]: ['K', '°C', '°F'],
      [Slot.UNIT_TYPES.ROTATIONAL_SPEED]: ['rpm'],
      [Slot.UNIT_TYPES.PERCENTAGE]: ['%'],
      [Slot.UNIT_TYPES.UNITLESS]: ['-'],
    }
  }

  static get UNITLESS_UNIT() { return Slot.UNIT_TYPE_UNIT_OPTIONS[Slot.UNIT_TYPES.UNITLESS][0] }

  static get ALL_UNIT_VALUES() {
    return Object.values(this.UNIT_TYPE_UNIT_OPTIONS)
      .reduce((acc, opts) => ([ ...acc, ...opts ]), [])
  }
  /* **************************************************************** */

  static get DISPLAY_TYPES() {
    return {
      TEMPERATURE: 'temperature',
      SWITCH: 'switch',
      FLOW: 'flow',
    }
  }

  static get SCHEMA() {
    return Joi.object({
      name: Joi.string().required(),
      displayType: Joi.string().allow(...Object.values(Slot.DISPLAY_TYPES), null).required(),
      dataStreams: Joi.array().items(DataStream.SCHEMA).required(),
      unit: Joi.string().allow(...this.ALL_UNIT_VALUES).required(), // inherited
    })
  }

  constructor({ name, functionalityId, displayType, dataStreams, unit }) {
    this.name = name
    this.functionalityId = functionalityId
    this.displayType = displayType
    this.dataStreams = dataStreams.map(ds => new DataStream(ds))
    this.unit = unit
  }

  serialize() {
    return {
      name: this.name,
      displayType: this.displayType,
      dataStreams: this.dataStreams.map(ds => ds.serialize()),
      unit: this.unit,
    }
  }

  assertStructure() {
    // Virtual
    throw new Error(`${this.constructor.name} requires an .assertStructure method to mutate. See mixin 'JOIous'`)
  }

  isUnitless() { return this.unit === Slot.UNITLESS_UNIT }

  /* *******************************************************************
   * GRAPH ACTIONS: CONNECTING SLOTS
   * **************************************************************** */
  _assertSlotDataTypeCompatible(otherSlot) {
    if (this.dataType !== otherSlot.dataType) {
      throw new SlotConnectionError(this, otherSlot, 'dataTypes must match between slots')
    }
  }

  _assertSlotUnitCompatible(otherSlot) {
    if (
      this.unit !== otherSlot.unit
    ) {
      throw new SlotConnectionError(this, otherSlot, 'units must match between slots')
    }
  }

  _assertSlotTypeCompatible(otherSlot) {
    if (this.type === 'OutSlot' && otherSlot.type !== 'InSlot') {
      throw new SlotConnectionError(this, otherSlot, 'must have complimentary types')
    }

    if (this.type === 'InSlot' && otherSlot.type !== 'OutSlot') {
      throw new SlotConnectionError(this, otherSlot, 'must have complimentary types')
    }
  }

  _assertConnectionBetweenIsPossible(otherSlot) {
    this._assertSlotDataTypeCompatible(otherSlot)
    this._assertSlotUnitCompatible(otherSlot)
    this._assertSlotTypeCompatible(otherSlot)
  }

  _validateConnectionBetweenIsPossible(otherSlot) {
    try {
      this._assertConnectionBetweenIsPossible(otherSlot)
      return true
    } catch (e) {
      if (e.name !== SlotConnectionError.NAME) throw e
      return false
    }
  }

  _addDataStreamAndAssertStructure(dataStream) {
    this.dataStreams.push(dataStream)
    this.assertStructure()
  }

  _createDataStreamTo(otherSlot, dataStreamOpts) {
    const {
      name: sourceSlotName,
      functionalityId: sourceFctId,
    } = this.type === 'OutSlot' ? this : otherSlot

    const {
      name: sinkSlotName,
      functionalityId: sinkFctId,
    } = this.type === 'InSlot' ? this : otherSlot

    return new DataStream({
      id: uuidv4(),
      sourceFctId,
      sourceSlotName,
      sinkFctId,
      sinkSlotName,
      averagingWindowSize: dataStreamOpts.averagingWindowSize,
    })
  }

  _connectToOrThrow(otherSlot, dataStream) {
    const thisDataStreamsLengthPre = this.dataStreams.length
    const otherDataStreamsLengthPre = otherSlot.dataStreams.length

    try {
      this._addDataStreamAndAssertStructure(dataStream)
      otherSlot._addDataStreamAndAssertStructure(dataStream)
      return dataStream
    } catch (e) {
      const thisDataStreamsLengthPost = this.dataStreams.length
      const otherDataStreamsLengthPost = otherSlot.dataStreams.length
      if (thisDataStreamsLengthPost > thisDataStreamsLengthPre) { this.dataStreams.pop() }
      if (otherDataStreamsLengthPost > otherDataStreamsLengthPre) { otherSlot.dataStreams.pop() }
    }
  }

  // safe - returns a public response
  addConnectionTo(otherSlot, dataStreamOpts = {}) {
    try {
      this._assertConnectionBetweenIsPossible(otherSlot)
      const dataStream = this._createDataStreamTo(otherSlot, dataStreamOpts)

      this._connectToOrThrow(otherSlot, dataStream)
      return publicSuccessRes({ thisSlot: this, otherSlot, dataStream })
    } catch (e) {
      return publicErrorRes({ errorMsg: e.message, thisSlot: this, otherSlot, dataStream: null })
    }
  }

  filterConnectableSlots(slots) {
    return slots.filter(slot => (
      this._validateConnectionBetweenIsPossible(slot)
    ))
  }

}

module.exports = Slot
