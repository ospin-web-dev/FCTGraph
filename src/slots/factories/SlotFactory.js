const FloatInSlot = require('../FloatInSlot')
const IntegerInSlot = require('../IntegerInSlot')
const BooleanInSlot = require('../BooleanInSlot')
const OneOfInSlot = require('../OneOfInSlot')

const OutSlot = require('../OutSlot')

class SlotFactory {

  static get SUPPORTED_CLASSES() {
    return [
      OutSlot,
      FloatInSlot,
      IntegerInSlot,
      BooleanInSlot,
      OneOfInSlot,
    ]
  }

  static get SUPPORTED_CLASSES_SCHEMAS() {
    return SlotFactory.SUPPORTED_CLASSES.map(
      SupportedClass => SupportedClass.SCHEMA,
    )
  }

  static classIsSupported(Class) {
    return SlotFactory.SUPPORTED_CLASSES.includes(Class)
  }

  static get DATATYPE_TO_IN_SLOT_CLASS() {
    return {
      [IntegerInSlot.DATA_TYPE]: IntegerInSlot,
      [FloatInSlot.DATA_TYPE]: FloatInSlot,
      [BooleanInSlot.DATA_TYPE]: BooleanInSlot,
      [OneOfInSlot.DATA_TYPE]: OneOfInSlot,
    }
  }

  static get DATATYPE_TO_OUT_SLOT_CLASS() {
    return {
      [OutSlot.DATA_TYPES.INTEGER]: OutSlot,
      [OutSlot.DATA_TYPES.FLOAT]: OutSlot,
    }
  }

  static get TYPE_TO_DATATYPE_SLOT_CLASSES() {
    return {
      OutSlot: SlotFactory.DATATYPE_TO_OUT_SLOT_CLASS,
      InSlot: SlotFactory.DATATYPE_TO_IN_SLOT_CLASS,
    }
  }

  static getSlotClass(slotData) {
    const { type, dataType } = slotData
    const classes = SlotFactory.TYPE_TO_DATATYPE_SLOT_CLASSES[type]

    if (!classes) {
      const json = JSON.stringify(slotData)
      throw new Error(`Slot type not supported ${type || 'FALSEY'}\n${json}`)
    }

    return classes[dataType]
  }

  static newFromType(slotData) {
    const { type, dataType } = slotData
    const FoundClass = SlotFactory.getSlotClass(slotData)

    if (!SlotFactory.classIsSupported(FoundClass)) {
      const json = JSON.stringify(slotData)
      throw new Error(`No ${dataType} slot class found for ${type || 'FALSEY'}\n${json}`)
    }

    return new FoundClass(slotData)
  }

  static new(slotData) {
    return SlotFactory.newFromType(slotData)
  }

}

module.exports = SlotFactory
