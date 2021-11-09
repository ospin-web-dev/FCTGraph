const Joi = require('joi')
const Functionality = require('./Functionality')

class PhysicalFunctionality extends Functionality {

  static get PORT_SCHEMA() {
    return Joi.object({
      name: Joi.string().required(),
      purpose: Joi.string().required(),
    })
  }

  static get SCHEMA() {
    return super.SCHEMA.concat(Joi.object({
      ports: Joi.array().items(this.PORT_SCHEMA),
    }))
  }

  constructor({
    ports = [],
    ...functionalityData
  }) {
    super({
      isVirtual: false,
      ...functionalityData,
    })
    this.ports = ports
  }

  serialize() {
    return {
      ...super.serialize(),
      ports: this.ports,
    }
  }

}

module.exports = PhysicalFunctionality
