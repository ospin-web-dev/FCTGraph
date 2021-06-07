const Joi = require('joi')
const { v4: uuidv4 } = require('uuid')

const JOIous = require('mixins/instanceMixins/JOIous')
const DataStream = require('dataStreams/DataStream')

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

  /* *******************************************************************
   * GRAPH ACTIONS
   * **************************************************************** */
  static _assertConnectionBetweenIsPossible(slotA, slotB) {
    if (slotA.dataType !== slotB.dataType) {
      throw new Error(`dataTypes must match between slots:\n${slotA}\n${slotB}`)
    }

    if (slotA.unit !== slotB.unit) {
      throw new Error(`units must match between slots:\n${slotA}\n${slotB}`)
    }

    if (slotA.type === 'OutSlot' && slotB.type !== 'InSlot') {
      throw new Error(`Slot:${slotA}\nand Slot:\n${slotB}\nmust have complimentary types`)
    }

    if (slotA.type === 'InSlot' && slotB.type !== 'OutSlot') {
      throw new Error(`Slot:${slotA}\nand Slot:\n${slotB}\nmust have complimentary types`)
    }
  }

  _assertStructure() {
    // assertStructure used in children classes - use private for kinder error handling
    if (typeof this.assertStructure !== 'function') {
      throw new Error(`${this} requires an .assertStructure method to mutate`)
    }

    this.assertStructure()
  }

  _forceAddConnection(dataStream) {
    this.dataStreams.push(dataStream)
    this._assertStructure()
  }

  _sendTo(targetSlot, opts = {}) {
    const dataStream = new DataStream({
      id: uuidv4(),
      sourceSlotName: this.name,
      sinkSlotName: targetSlot.name,
      averagingWindowSize: opts.averagingWindowSize,
    })

    this._forceAddConnection(dataStream)
    targetSlot._forceAddConnection(dataStream)
  }

  connect(otherSlot, opts) {
    Slot._assertConnectionBetweenIsPossible(this, otherSlot)

    const dataStream = new DataStream({
      id: uuidv4(),
      sourceSlotName: this.type === 'OutSlot' ? this.name : otherSlot.name,
      sinkSlotName: this.type === 'InSlot' ? this.name : otherSlot.name,
      averagingWindowSize: opts.averagingWindowSize,
    })

    this._forceAddConnection(dataStream)
    otherSlot._forceAddConnection(dataStream)
  }

}

module.exports = Slot
