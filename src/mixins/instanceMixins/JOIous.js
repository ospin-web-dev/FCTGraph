const Joi = require('joi')

const JOIous = ReceivingClass => class extends ReceivingClass {

  static get isJOIous() { return true }

  attemptStructure() {
    Joi.attempt(
      this.serialize(),
      ReceivingClass.SCHEMA,
    )
  }

  validateStructure() {
    ReceivingClass.SCHEMA.validate(this.serialize())
  }

}

module.exports = JOIous
