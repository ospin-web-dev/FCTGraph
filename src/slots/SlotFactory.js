const InSlot = require('./InSlot')
const OutSlot = require('./OutSlot')

class SlotFactory {

  static get SUPPORTED_CLASSES() { return [ InSlot, OutSlot ] }

  static get SUPPORTED_CLASSES_SCHEMAS() {
    return this.SUPPORTED_CLASSES.map(
      SupportedClass => SupportedClass.SCHEMA,
    )
  }

  static classIsSupported(Class) {
    return this.SUPPORTED_CLASSES.includes(Class)
  }

  static get TYPE_TO_CLASS() { return ({ InSlot, OutSlot }) }

  static newFromType(slotData) {
    const { type } = slotData
    const FoundClass = this.TYPE_TO_CLASS[type]

    if (!this.classIsSupported(FoundClass)) {
      throw new Error('Slot type not supported', type, slotData)
    }

    return new FoundClass(slotData)
  }

  static new(slotData) {
    return this.newFromType(slotData)
  }

}

module.exports = SlotFactory
