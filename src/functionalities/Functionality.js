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
    this.slots = slots.map(SlotFactory.new)
  }

  serialize() {
    return {
      id: this.id,
      deviceId: this.deviceId,
      slots: this.slots.forEach(slot => slot.serialize),
    }
  }

}

module.exports = Functionality
