const Joi = require('joi')

const RegexUtils = require('../utils/RegexUtils')
const SlotFactory = require('../slots/factories/SlotFactory')

class Functionality {

  static get SCHEMA() {
    return Joi.object({
      id: Joi.string().pattern(RegexUtils.UUIDV4).required(),
      name: Joi.string().required(),
      slots: Joi.array().items(Joi.alternatives().try(
        ...SlotFactory.SUPPORTED_CLASSES_SCHEMAS,
      )).required(),
    })
  }

  constructor({
    id,
    name,
    slots,
  }) {
    this.id = id
    this.name = name
    this.slots = Array.isArray(slots)
      ? slots.map(SlotFactory.new)
      : []
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

  /* *******************************************************************
   * GRAPH ACTIONS
   * **************************************************************** */
  getConnectableSlotsToFctSlotsMapping(targetFct) {
    /* returns {
     *   <this.slotIdA>: [ <targetFctSlotA>, <targetFctSlotB> ],
     *   <this.slotIdB>: [ <targetFctSlotB>, <targetFctSlotC> ],
     *   <this.slotIdC>: [],
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
