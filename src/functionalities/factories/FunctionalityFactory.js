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
const HeiFlowUltimate120 = require('../HeiFlowUltimate120')
const HeiFlowUltimate600 = require('../HeiFlowUltimate600')
const StirrerActuator = require('../StirrerActuator')
const HeidolphOverheadStirrer = require('../HeidolphOverheadStirrer')
const HeiTorqueUltimate100 = require('../HeiTorqueUltimate100')
const HeiTorqueUltimate200 = require('../HeiTorqueUltimate200')
const HeiTorqueUltimate400 = require('../HeiTorqueUltimate400')
const HeidolphMagneticStirrer = require('../HeidolphMagneticStirrer')
const HeiConnect = require('../HeiConnect')
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
      HeiFlowUltimate120,
      HeiFlowUltimate600,
      HeiTorqueUltimate100,
      HeiTorqueUltimate200,
      HeiTorqueUltimate400,
      HeiConnect,
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

  static assertClassHasAssertValidDataAndNew(Class) {
    if (!Class.assertValidDataAndNew) {
      throw new Error(`FunctionalityFactory found class: ${Class.name} must have a 'assertValidDataAndNew' method. The class should be a JOIous, which composes this method.`)
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

  static assertValidDataAndNew(funcData) {
    const Class = FunctionalityFactory.findClassFromFuncData(funcData)
    FunctionalityFactory.assertClassHasAssertValidDataAndNew(Class)

    return Class.assertValidDataAndNew({
      id: uuidv4(),
      ...funcData,
    })
  }

}

module.exports = FunctionalityFactory
