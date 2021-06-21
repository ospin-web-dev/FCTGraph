const TemperatureSensor = require('../TemperatureSensor')
const UnknownSensor = require('../UnknownSensor')
const UnknownActuator = require('../UnknownActuator')
const PIDController = require('../PIDController')
const HeaterActuator = require('../HeaterActuator')
const IntervalOut = require('../IntervalOut')
const PushOut = require('../PushOut')
const PushIn = require('../PushIn')

class FunctionalityFactory {

  static get SUB_TYPE_TO_CLASS() {
    return ({
      TemperatureSensor,
      UnknownSensor,
      UnknownActuator,
      PIDController,
      HeaterActuator,
      IntervalOut,
      PushOut,
      PushIn,
    })
  }

  static get SUPPORTED_CLASSES() {
    return Object.values(FunctionalityFactory.SUB_TYPE_TO_CLASS)
  }

  static get SUPPORTED_SUB_TYPES() {
    return Object.keys(FunctionalityFactory.SUB_TYPE_TO_CLASS)
  }

  static get SUPPORTED_TYPES() {
    return (
      FunctionalityFactory.SUPPORTED_CLASSES.map(funcClass => (
        Object.getPrototypeOf(funcClass).TYPE
      ))
    )
  }

  static get SUPPORTED_CLASSES_SCHEMAS() {
    return FunctionalityFactory.SUPPORTED_CLASSES.map(
      SupportedClass => SupportedClass.SCHEMA,
    )
  }

  static assertTypeAndSubTypeAreSupported(funcData) {
    const { type, subType } = funcData

    if (!FunctionalityFactory.SUPPORTED_TYPES.includes(type)) {
      const json = JSON.stringify(funcData)
      throw new Error(`Functionality type not supported ${type || 'FALSEY'}\n${json}`)
    }

    if (!FunctionalityFactory.SUPPORTED_SUB_TYPES.includes(subType)) {
      const json = JSON.stringify(funcData)
      throw new Error(`Functionality subType not supported ${subType || 'FALSEY'}\n${json}`)
    }
  }

  static newFromSubType(funcData) {
    FunctionalityFactory.assertTypeAndSubTypeAreSupported(funcData)

    const { subType } = funcData
    const FoundClass = FunctionalityFactory.SUB_TYPE_TO_CLASS[subType]

    return new FoundClass(funcData)
  }

  static new(functionalityData) {
    return FunctionalityFactory.newFromSubType(functionalityData)
  }

}

module.exports = FunctionalityFactory
