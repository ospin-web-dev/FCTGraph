const FloatInSlot = require('../FloatInSlot')
const IntegerInSlot = require('../IntegerInSlot')
const BooleanInSlot = require('../BooleanInSlot')
const OneOfInSlot = require('../OneOfInSlot')
const AnyInSlot = require('../AnyInSlot')

const FloatOutSlot = require('../FloatOutSlot')
const IntegerOutSlot = require('../IntegerOutSlot')
const BooleanOutSlot = require('../BooleanOutSlot')
const OneOfOutSlot = require('../OneOfOutSlot')
const AnyOutSlot = require('../AnyOutSlot')

class SlotFactory {

  static get SUPPORTED_IN_SLOT_CLASSES() {
    return [
      FloatInSlot,
      IntegerInSlot,
      BooleanInSlot,
      OneOfInSlot,
      AnyInSlot,
    ]
  }

  static get SUPPORTED_OUT_SLOT_CLASSES() {
    return [
      FloatOutSlot,
      IntegerOutSlot,
      BooleanOutSlot,
      OneOfOutSlot,
      AnyOutSlot,
    ]
  }

  static get SUPPORTED_CLASSES() {
    return [
      ...SlotFactory.SUPPORTED_IN_SLOT_CLASSES,
      ...SlotFactory.SUPPORTED_OUT_SLOT_CLASSES,
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
      [AnyInSlot.DATA_TYPE]: AnyInSlot,
    }
  }

  static get DATATYPE_TO_OUT_SLOT_CLASS() {
    return {
      [IntegerOutSlot.DATA_TYPE]: IntegerOutSlot,
      [FloatOutSlot.DATA_TYPE]: FloatOutSlot,
      [BooleanOutSlot.DATA_TYPE]: BooleanOutSlot,
      [OneOfOutSlot.DATA_TYPE]: OneOfOutSlot,
      [AnyOutSlot.DATA_TYPE]: AnyOutSlot,
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

    const FoundClass = classes[dataType]

    if (!SlotFactory.classIsSupported(FoundClass)) {
      const json = JSON.stringify(slotData)
      throw new Error(`No ${dataType} slot class found for ${type}\n${json}`)
    }

    return FoundClass
  }

  static newFromType(slotData) {
    const FoundClass = SlotFactory.getSlotClass(slotData)

    return new FoundClass(slotData)
  }

  static new(slotData) {
    return SlotFactory.newFromType(slotData)
  }

}

module.exports = SlotFactory
