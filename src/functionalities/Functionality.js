const Joi = require('joi')

const RegexUtils = require('../utils/RegexUtils')
const InSlot = require('../slots/InSlot')
const OutSlot = require('../slots/OutSlot')
const SlotFactory = require('../slots/factories/SlotFactory')
const AddSlotError = require('./AddSlotError')

class Functionality {

  static get TYPE() { return null }

  static get SUB_TYPE() { return null }

  static get SCHEMA() {
    return Joi.object({
      id: Joi.string().pattern(RegexUtils.UUIDV4).required(),
      name: Joi.string().required(),
      type: Joi.string().allow(this.TYPE).required(),
      subType: Joi.string().allow(this.SUB_TYPE).required(),
      slots: Joi.array().items(Joi.alternatives().try(
        ...SlotFactory.SUPPORTED_CLASSES_SCHEMAS,
      )).required(),
      controllerName: Joi.string().allow(''), // this is used to support the old devices: https://github.com/ospin-web-dev/hambda/issues/913
      isVirtual: Joi.boolean().required(),
    })
  }

  get isPhysical() { return !this.isVirtual }

  get slotNames() { return this.slots.map(({ name }) => name) }

  _assertSlotNameUnique(slot) {
    if (this.slotNames.includes(slot.name)) {
      throw new AddSlotError(slot, `functionality already has a slot with the same name. current slot names: ${this.slotNames}`)
    }
  }

  _assertSlotCanBeAdded(slot) {
    this._assertSlotNameUnique(slot)
  }

  _addSlotByDataOrThrow(slotData) {
    const newSlot = SlotFactory.new({ ...slotData, functionality: this })
    newSlot.assertStructure()

    this._assertSlotCanBeAdded(newSlot)
    this.slots.push(newSlot)

    return newSlot
  }

  _addSlotsByDataOrThrow(slotsData) {
    // NOTE: slots should never be added or removed outside of initialization
    slotsData.forEach(slotData => this._addSlotByDataOrThrow(slotData))
  }

  constructor({
    id,
    name,
    fctGraph,
    isVirtual = false,
    slots: slotsData,
  }) {
    this.id = id
    this.name = name
    this.type = this.constructor.TYPE
    this.subType = this.constructor.SUB_TYPE
    this.fctGraph = fctGraph
    this.isVirtual = isVirtual
    this.slots = []

    if (slotsData) this._addSlotsByDataOrThrow(slotsData)
  }

  serialize() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      subType: this.subType,
      isVirtual: this.isVirtual,
      slots: this.slots.map(slot => slot.serialize()),
    }
  }

  slotTypes() {
    return this.slots.map(({ type }) => type)
  }

  getInSlots() {
    return this.slots.filter(({ type }) => type === InSlot.TYPE)
  }

  get inSlots() { return this.getInSlots() }

  getOutSlots() {
    return this.slots.filter(({ type }) => type === OutSlot.TYPE)
  }

  get outSlots() { return this.getOutSlots() }

  getSlotByName(slotName) {
    return this.slots.find(({ name }) => name === slotName)
  }

  getConnectableSlotsToFctSlotsMapping(targetFct) {
    /* returns {
     *   <this.slotA.name>: [ <targetFctSlotA>, <targetFctSlotB> ],
     *   <this.slotB.name>: [ <targetFctSlotB>, <targetFctSlotC> ],
     *   <this.slotC.name>: [],
     *   ...,
     * }
     */
    const { slots: targetSlots } = targetFct

    return this.slots.reduce((mapping, slot) => ({
      [slot.name]: slot.filterConnectableSlots(targetSlots),
      ...mapping,
    }), {})
  }

  isPossibleToConnectToFct(targetFct) {
    const slotsToSlotsMap = this.getConnectableSlotsToFctSlotsMapping(targetFct)

    return Object.values(slotsToSlotsMap).some(possibleSlots => (
      possibleSlots.length > 0
    ))
  }

  filterConnectableFctsFromMany(targetFcts) {
    return targetFcts.filter(targetFct => (
      this.isPossibleToConnectToFct(targetFct)
    ))
  }

  isConnectedToFct(otherFunctionality) {
    return this.slots.some(mySlot => (
      mySlot.isConnectedToOneOfManySlots(otherFunctionality.slots)
    ))
  }

  get dataStreamsCount() {
    // divide by two as every fct is returning those dataStreams that are connected to it
    return this.slots.reduce((dataStreamsCount, slot) => (
      dataStreamsCount + slot.dataStreams.length
    ), 0) / 2
  }

  _getConnectedFcts(targetSlots = this.slots) {
    return targetSlots.reduce((connectedFcts, slot) => {
      const fcts = slot.connectedFunctionalities.filter(
        connectedFct => connectedFct !== this,
      )
      return connectedFcts.concat(fcts)
    }, [])
  }

  get connectedFcts() {
    return this._getConnectedFcts()
  }

  get sources() {
    return this._getConnectedFcts(this.inSlots)
  }

  get sinks() {
    return this._getConnectedFcts(this.outSlots)
  }

  get connectedPushOutNodes() {
    return this.sinks.filter(sink => sink.subType === 'PushOut')
  }

  getConnectedFctsByName(targetName) {
    return this.connectedFcts.filter(({ name }) => (
      targetName === name
    ))
  }

  isSubType(subType) {
    return (
      this.constructor.SUB_TYPE === subType
      && this.subType === subType
    )
  }

}

module.exports = Functionality
