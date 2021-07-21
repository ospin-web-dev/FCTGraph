const Joi = require('joi')

const RegexUtils = require('../utils/RegexUtils')
const InSlot = require('../slots/InSlot')
const OutSlot = require('../slots/OutSlot')
const SlotFactory = require('../slots/factories/SlotFactory')

class Functionality {

  static get SCHEMA() {
    return Joi.object({
      id: Joi.string().pattern(RegexUtils.UUIDV4).required(),
      name: Joi.string().required(),
      slots: Joi.array().items(Joi.alternatives().try(
        ...SlotFactory.SUPPORTED_CLASSES_SCHEMAS,
      )).required(),
      controllerName: Joi.string().allow(''), // this is used to support the old devices: https://github.com/ospin-web-dev/hambda/issues/913
    })
  }

  _addSlot(slotData) {
    const { id: functionalityId } = this
    const newSlot = SlotFactory.new({ ...slotData, functionalityId })

    this.slots.push(newSlot)

    return newSlot
  }

  _addSlots(slotsData) {
    // NOTE: slots should never be added or removed outside of initialization
    slotsData.map(slotData => this._addSlot(slotData))
  }

  constructor({
    id,
    name,
    slots: slotsData,
  }) {
    this.id = id
    this.name = name
    this.slots = []
    if (slotsData) this._addSlots(slotsData)
  }

  serialize() {
    return {
      id: this.id,
      name: this.name,
      slots: this.slots.map(slot => slot.serialize()),
    }
  }

  slotTypes() {
    return this.slots.map(({ type }) => type)
  }

  getInSlots() {
    return this.slots.filter(({ type }) => type === InSlot.TYPE)
  }

  getOutSlots() {
    return this.slots.filter(({ type }) => type === OutSlot.TYPE)
  }

  getSlotByName(slotName) {
    return this.slots.find(({ name }) => name === slotName)
  }

  /* *******************************************************************
   * GRAPH ACTIONS
   * **************************************************************** */
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

}

module.exports = Functionality
