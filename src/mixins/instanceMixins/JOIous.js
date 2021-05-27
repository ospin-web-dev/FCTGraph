const JOIous = ReceivingClass => class extends ReceivingClass {

  static get isJOIous() { return true }

  assertStructure() {
    // TODO: ref key error is something with the assert method because validate works fine!
    ReceivingClass.SCHEMA.assert(this.serialize())
  }

  validateStructure() {
    ReceivingClass.SCHEMA.validate(this.serialize())
  }

}

module.exports = JOIous
