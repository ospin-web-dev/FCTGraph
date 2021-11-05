const { v4: uuidv4 } = require('uuid')

const TemperatureSensor = require('../TemperatureSensor')
const UnknownSensor = require('../UnknownSensor')
const UnknownActuator = require('../UnknownActuator')
const PIDController = require('../PIDController')
const HysteresisController = require('../HysteresisController')
const HeaterActuator = require('../HeaterActuator')
const IntervalOut = require('../IntervalOut')
const PumpActuator = require('../PumpActuator')
const HeidolphPump = require('../HeidolphPump')
const StirrerActuator = require('../StirrerActuator')
const HeidolphMagneticStirrer = require('../HeidolphMagneticStirrer')
const HeidolphOverheadStirrer = require('../HeidolphOverheadStirrer')
const HeidolphPumpByTorqueHysteresisController = require('../HeidolphPumpByTorqueHysteresisController')
const PushOut = require('../PushOut')
const PushIn = require('../PushIn')

class FunctionalityFactory {

  static get SUB_TYPE_TO_CLASS() {
    return ({
      TemperatureSensor,
      UnknownSensor,
      UnknownActuator,
      PIDController,
      HysteresisController,
      HeaterActuator,
      IntervalOut,
      PumpActuator,
      HeidolphPump,
      StirrerActuator,
      HeidolphMagneticStirrer,
      HeidolphOverheadStirrer,
      HeidolphPumpByTorqueHysteresisController,
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
      throw new Error(`Functionality type not supported: ${type || 'FALSEY'}\n${json}`)
    }

    if (!FunctionalityFactory.SUPPORTED_SUB_TYPES.includes(subType)) {
      const json = JSON.stringify(funcData)
      throw new Error(`Functionality subType not supported: ${subType || 'FALSEY'}\n${json}`)
    }
  }

  static assertClassHasNewAndAssertStructure(Class) {
    if (!Class.newAndAssertStructure) {
      throw new Error(`FunctionalityFactory found class: ${Class.name} must have a 'newAndAssertStructure' method. It should be a JOIous, which composes this method.`)
    }
  }

  static findClassFromFuncData(funcData) {
    FunctionalityFactory.assertTypeAndSubTypeAreSupported(funcData)

    const { subType } = funcData
    return FunctionalityFactory.SUB_TYPE_TO_CLASS[subType]
  }

  static new(funcData) {
    const Class = FunctionalityFactory.findClassFromFuncData(funcData)

    return new Class({
      id: uuidv4(),
      ...funcData,
    })
  }

  static newAndAssertStructure(funcData) {
    const Class = FunctionalityFactory.findClassFromFuncData(funcData)
    FunctionalityFactory.assertClassHasNewAndAssertStructure(Class)

    return Class.newAndAssertStructure({
      id: uuidv4(),
      ...funcData,
    })
  }

}

module.exports = FunctionalityFactory
