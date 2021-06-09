const Joi = require('joi')
const { v4: uuidv4 } = require('uuid')

const DataStream = require('dataStreams/DataStream')
const SlotConnectionError = require('./SlotConnectionError')

class Slot {

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

  static get UNITLESS_UNIT() { return Slot.UNIT_TYPE_UNIT_OPTIONS.unitless[0] }

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
      displayType: Joi.string().allow(...Object.values(Slot.DISPLAY_TYPES)).required(),
      dataStreams: Joi.array().items(DataStream.SCHEMA).required(),
      unit: Joi.string().allow(...this.ALL_UNIT_VALUES).required(), // inherited
    })
  }

  constructor({ name, displayType, dataStreams, unit }) {
    this.name = name
    this.displayType = displayType
    this.dataStreams = dataStreams
    this.unit = unit
  }

  serialize() {
    return {
      name: this.name,
      displayType: this.displayType,
      dataStreams: this.dataStreams,
      unit: this.unit,
    }
  }

  assertStructure() {
    // Virtual
    throw new Error(`${this} requires an .assertStructure method to mutate. See mixin 'JOIous'`)
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
      && !this.isUnitless()
      && !otherSlot.isUnitless()
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

  _forceAddConnection(dataStream) {
    this.dataStreams.push(dataStream)
    this.assertStructure()
  }

  connect(otherSlot, opts = {}) {
    this._assertConnectionBetweenIsPossible(otherSlot)

    const dataStream = new DataStream({
      id: uuidv4(),
      sourceSlotName: this.type === 'OutSlot' ? this.name : otherSlot.name,
      sinkSlotName: this.type === 'InSlot' ? this.name : otherSlot.name,
      averagingWindowSize: opts.averagingWindowSize,
    })

    this._forceAddConnection(dataStream)
    otherSlot._forceAddConnection(dataStream)

    return { dataStream }
  }

  filterConnectableSlots(slots) {
    return slots.filter(slot => (
      this._validateConnectionBetweenIsPossible(slot)
    ))
  }

}

module.exports = Slot
