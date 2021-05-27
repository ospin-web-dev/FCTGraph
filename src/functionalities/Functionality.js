const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const RegexUtils = require('../utils/RegexUtils')
const SlotFactory = require('../slots/SlotFactory')

class Functionality {

  static get TYPES() {
    return {
      SENSOR: 'Sensor',
      ACTUATOR: 'Actuator',
      CONTROLLER: 'Controller',
      IONODE: 'IONode',
    }
  }

  static get SCHEMA() {
    return Joi.object({
      id: Joi.string().pattern(RegexUtils.UUIDV4).required(),
      name: Joi.string().required(),
      type: Joi.string().allow(...Object.values(Functionality.TYPES)),
      subType: Joi.string().required(),
      slots: Joi.array().items(Joi.alternatives().try(
        ...SlotFactory.SUPPORTED_CLASSES_SCHEMAS,
      )).required(),
    })
  }

  constructor({
    id,
    name,
    type,
    subType,
    slots,
  }) {
    this.id = id
    this.name = name
    this.type = type
    this.subType = subType
    this.slots = slots.map(SlotFactory.new)

    this.assertStructure()
  }

  serialize() {
    return {
      id: this.id,
      deviceId: this.deviceId,
      deviceDefault: this.deviceDefault,
      slots: this.slots.forEach(func => func.serialize),
    }
  }

}

module.exports = (
  JOIous(Functionality)
)
