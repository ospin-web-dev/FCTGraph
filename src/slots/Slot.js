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

  static _assertSlotDataTypesCompatible(slotA, slotB) {
    if (slotA.dataType !== slotB.dataType) {
      throw new SlotConnectionError(slotA, slotB, 'dataTypes must match between slots')
    }
  }

  static _assertSlotUnitsCompatible(slotA, slotB) {
    if (
      slotA.unit !== slotB.unit
    ) {
      throw new SlotConnectionError(slotA, slotB, 'units must match between slots')
    }
  }

  static _assertSlotTypesCompatible(slotA, slotB) {
    if (slotA.type === 'OutSlot' && slotB.type !== 'InSlot') {
      throw new SlotConnectionError(slotA, slotB, 'must have complimentary types')
    }

    if (slotA.type === 'InSlot' && slotB.type !== 'OutSlot') {
      throw new SlotConnectionError(slotA, slotB, 'must have complimentary types')
    }
  }

  static _assertConnectionBetweenSlotsDoesntAlreadyExit(slotA, slotB) {
    if (slotA.isConnectedToSlot(slotB)) {
      throw new SlotConnectionError(slotA, slotB, 'already connected to target slot')
    }
  }

  static _assertConnectionBetweenIsPossible(slotA, slotB) {
    Slot._assertSlotDataTypesCompatible(slotA, slotB)
    Slot._assertSlotUnitsCompatible(slotA, slotB)
    Slot._assertSlotTypesCompatible(slotA, slotB)
    Slot._assertConnectionBetweenSlotsDoesntAlreadyExit(slotA, slotB)

    slotA._assertHasRoomForConnectionTo(slotB)
    slotB._assertHasRoomForConnectionTo(slotA)
  }

  static _validateConnectionBetweenIsPossible(slotA, slotB) {
    try {
      this._assertConnectionBetweenIsPossible(slotA, slotB)
      return true
    } catch (e) {
      if (e.name !== SlotConnectionError.NAME) throw e
      return false
    }
  }

  static get SCHEMA() {
    return Joi.object({
      name: Joi.string().required(),
      displayType: Joi.string().allow(null).required(),
      dataStreams: Joi.array().items(DataStream.SCHEMA).required(),
      unit: Joi.string().allow(...this.ALL_UNIT_VALUES).required(),
    })
  }

  constructor({
    name,
    functionality,
    displayType,
    unit,
  }) {
    this.name = name
    this.functionality = functionality
    this.displayType = displayType || null
    this.unit = unit
    this.dataStreams = []
  }

  get functionalityId() { return this.functionality.id }

  get isEmpty() { return this.dataStreams.length === 0 }

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

  _assertHasRoomForConnectionTo() {
    // Virtual
    throw new Error(`${this.constructor.name} requires an ._assertHasRoomForConnectionTo method`)
  }

  _addDataStream(dataStream) {
    this.dataStreams.push(dataStream)
  }

  _createDataStreamTo(otherSlot, dataStreamData) {
    const sourceSlot = this.type === 'OutSlot' ? this : otherSlot
    const sinkSlot = this.type === 'InSlot' ? this : otherSlot

    return new DataStream({
      id: uuidv4(),
      sinkSlot,
      sourceSlot,
      ...dataStreamData,
    })
  }

  _connectTo(otherSlot, dataStream) {
    this._addDataStream(dataStream)
    otherSlot._addDataStream(dataStream)
  }

  // safe - returns a public response
  connectTo(otherSlot, dataStreamData = {}) {
    try {
      Slot._assertConnectionBetweenIsPossible(this, otherSlot)
      const dataStream = this._createDataStreamTo(otherSlot, dataStreamData)
      this._connectTo(otherSlot, dataStream)

      return publicSuccessRes({ thisSlot: this, otherSlot, dataStream })
    } catch (e) {
      return publicErrorRes({ errorMsg: e.message, thisSlot: this, otherSlot, dataStream: null })
    }
  }

  filterConnectableSlots(slots) {
    return slots.filter(slot => (
      Slot._validateConnectionBetweenIsPossible(this, slot)
    ))
  }

  isConnectedToSlot(otherSlot) {
    return this.dataStreams.some(dataStream => (
      dataStream.isConnectionBetweenTwoSlots(this, otherSlot)
    ))
  }

  isConnectedToOneOfManySlots(otherSlots) {
    return otherSlots.some(otherSlot => (
      this.isConnectedToSlot(otherSlot)
    ))
  }

  getDataStreamToSlot(otherSlot) {
    return this.dataStreams.find(dataStream => (
      dataStream.isConnectionBetweenTwoSlots(this, otherSlot)
    ))
  }

  getAllDataStreamsToManySlots(otherSlots) {
    return otherSlots.reduce((connectingDataStreams, otherSlot) => {
      const dataStreamToOtherSlot = (
        this.getDataStreamToSlot(otherSlot)
      )

      return dataStreamToOtherSlot
        ? connectingDataStreams.concat([ dataStreamToOtherSlot ])
        : connectingDataStreams
    }, [])
  }

  get connectedSlots() {
    return this.dataStreams.map(dataStream => (
      dataStream.getOpposingSlotTo(this)
    ))
  }

  get connectedFunctionalities() {
    return this.connectedSlots.map(connectedSlot => (
      connectedSlot.functionality
    ))
  }

  get isConnectedToOutputNode() {
    return this.connectedFunctionalities.some(connectedFunctionality => (
      connectedFunctionality.isOutputNode
    ))
  }

  get isConnectedToInputNode() {
    return this.connectedFunctionalities.some(connectedFunctionality => (
      connectedFunctionality.isInputNode
    ))
  }

  _removeDataStreamTo(otherSlot) {
    this.dataStreams = this.dataStreams.filter(dataStream => (
      !dataStream.slotIsSourceOrSink(otherSlot)
    ))
  }

  disconnectFrom(otherSlot) {
    this._removeDataStreamTo(otherSlot)
    otherSlot._removeDataStreamTo(this)
  }

  disconnectAll() {
    this.connectedSlots.forEach(this.disconnectFrom, this)
  }

}

module.exports = Slot
