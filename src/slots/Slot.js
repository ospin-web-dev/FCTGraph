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
      [this.UNIT_TYPES.TEMPERATURE]: ['K', '°C', '°F'],
      [this.UNIT_TYPES.ROTATIONAL_SPEED]: ['rpm'],
      [this.UNIT_TYPES.PERCENTAGE]: ['%'],
      [this.UNIT_TYPES.UNITLESS]: ['-'],
    }
  }

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

  /* *******************************************************************
   * GRAPH ACTIONS: CONNECTING SLOTS
   * **************************************************************** */
  _assertConnectionBetweenIsPossible(otherSlot) {
    if (this.dataType !== otherSlot.dataType) {
      throw new SlotConnectionError(this, otherSlot, 'dataTypes must match between slots')
    }

    if (this.unit !== otherSlot.unit) {
      throw new SlotConnectionError(this, otherSlot, 'units must match between slots')
    }

    if (this.type === 'OutSlot' && otherSlot.type !== 'InSlot') {
      throw new SlotConnectionError(this, otherSlot, 'must have complimentary types')
    }

    if (this.type === 'InSlot' && otherSlot.type !== 'OutSlot') {
      throw new SlotConnectionError(this, otherSlot, 'must have complimentary types')
    }
  }

  _validateConnectionBetweenIsPossible(otherSlot) {
    try {
      this._assertConnectionBetweenIsPossible(this, otherSlot)
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

  connect(otherSlot, opts) {
    this._assertConnectionBetweenIsPossible(this, otherSlot)

    const dataStream = new DataStream({
      id: uuidv4(),
      sourceSlotName: this.type === 'OutSlot' ? this.name : otherSlot.name,
      sinkSlotName: this.type === 'InSlot' ? this.name : otherSlot.name,
      averagingWindowSize: opts.averagingWindowSize,
    })

    this._forceAddConnection(dataStream)
    otherSlot._forceAddConnection(dataStream)
  }

  filterConnectableSlots(slots) {
    return slots.filter(slot => (
      this._validateConnectionBetweenIsPossible(this, slot)
    ))
  }

}

module.exports = Slot
