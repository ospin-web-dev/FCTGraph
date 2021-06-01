const InSlot = require('../InSlot')
const OutSlot = require('../OutSlot')

class SlotFactory {

  static get SUPPORTED_CLASSES() { return [ InSlot, OutSlot ] }

  static get SUPPORTED_CLASSES_SCHEMAS() {
    return SlotFactory.SUPPORTED_CLASSES.map(
      SupportedClass => SupportedClass.SCHEMA,
    )
  }

  static classIsSupported(Class) {
    return SlotFactory.SUPPORTED_CLASSES.includes(Class)
  }

  static get TYPE_TO_CLASS() { return ({ InSlot, OutSlot }) }

  static newFromType(slotData) {
    const { type } = slotData
    const FoundClass = SlotFactory.TYPE_TO_CLASS[type]

    if (!SlotFactory.classIsSupported(FoundClass)) {
      const json = JSON.stringify(slotData)
      throw new Error(`Slot type not supported ${type || 'FALSEY'}\n${json}`)
    }

    return new FoundClass(slotData)
  }

  static new(slotData) {
    return SlotFactory.newFromType(slotData)
  }

}

export default SlotFactory
//module.exports = SlotFactory
