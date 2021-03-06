const Joi = require('joi')
const ArrayUtils = require('@choux/array-utils')

const RegexUtils = require('../utils/RegexUtils')
const ObjUtils = require('../utils/ObjUtils')
const InSlot = require('../slots/InSlot')
const OutSlot = require('../slots/OutSlot')
const SlotFactory = require('../slots/factories/SlotFactory')
const AddSlotError = require('./FCTErrors/AddSlotError')
const SetProtectedPropertyError = require('./FCTErrors/SetProtectedPropertyError')

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
      )),
      isVirtual: Joi.boolean(),
      firmwareBlackBox: Joi.object(),
    })
  }

  static get _NON_TEMPLATE_KEYS() {
    return [ 'id', 'name' ]
  }

  get isPhysical() { return !this.isVirtual }

  get slotNames() { return this.slots.map(({ name }) => name) }

  get subType() { return this.constructor.SUB_TYPE }

  set subType(val) {
    throw new SetProtectedPropertyError(this, 'subType', val)
  }

  get type() { return this.constructor.TYPE }

  set type(val) {
    throw new SetProtectedPropertyError(this, 'type', val)
  }

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
    firmwareBlackBox = {},
    slots: slotsData = [],
  }) {
    this.id = id
    this.name = name
    this.fctGraph = fctGraph
    this.isVirtual = isVirtual
    this.firmwareBlackBox = firmwareBlackBox
    this.slots = []

    if (slotsData.length > 0) this._addSlotsByDataOrThrow(slotsData)
  }

  serialize() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      subType: this.subType,
      isVirtual: this.isVirtual,
      firmwareBlackBox: this.firmwareBlackBox,
      slots: this.slots.map(slot => slot.serialize()),
    }
  }

  serializeToTemplate() {
    const serializedFctTemplate = ObjUtils.exclude(
      this.serialize(),
      this.constructor._NON_TEMPLATE_KEYS,
    )

    const slotTemplates = this.slots.map(slot => slot.serializeToTemplate())
    const sortedSlotTemplates = ArrayUtils.sortObjectsByKeyValue(slotTemplates, 'name')

    serializedFctTemplate.slots = sortedSlotTemplates

    return ObjUtils.sortByKeys(serializedFctTemplate)
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

  get dataStreams() {
    return Array.from(
      this.slots.reduce((fctDataStreams, { dataStreams }) => (
        new Set([ ...fctDataStreams, ...dataStreams ])
      ), new Set()),
    )
  }

  get dataStreamsCount() { return this.dataStreams.length }

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

  get isConnected() {
    return this.connectedFcts.length > 0
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

  isDeepEqual(fct) {
    return ObjUtils.objsDeepEqual(this.serialize(), fct.serialize())
  }

  isSubType(subType) { return this.subType === subType }

  isFunctionallyEqualTo(otherFct) {
    const thisFctTemplate = this.serializeToTemplate()
    const otherFctTemplate = otherFct.serializeToTemplate()

    return ObjUtils.objsDeepEqual(thisFctTemplate, otherFctTemplate)
  }

  disconnectAll() { this.slots.forEach(slot => slot.disconnectAll()) }

  resolveInterSlotUnit() {
    return null
  }

}

module.exports = Functionality
