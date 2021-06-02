const TemperatureSensor = require('../TemperatureSensor')
const PIDController = require('../PIDController')
const HeaterActuator = require('../HeaterActuator')
const IntervalOut = require('../IntervalOut')
const PushOut = require('../PushOut')

class FunctionalityFactory {

  static get SUPPORTED_CLASSES() {
    return [
      TemperatureSensor,
      PIDController,
      HeaterActuator,
      IntervalOut,
      PushOut,
    ]
  }

  static get SUPPORTED_CLASSES_SCHEMAS() {
    return FunctionalityFactory.SUPPORTED_CLASSES.map(
      SupportedClass => SupportedClass.SCHEMA,
    )
  }

  static get SUB_TYPE_TO_CLASS() { return ({ TemperatureSensor }) }

  static classIsSupported(Class) {
    return FunctionalityFactory.SUPPORTED_CLASSES.includes(Class)
  }

  static newFromSubType(sensorData) {
    const { subType } = sensorData
    const FoundClass = FunctionalityFactory.SUB_TYPE_TO_CLASS[subType]

    if (!FunctionalityFactory.classIsSupported(FoundClass)) {
      const json = JSON.stringify(sensorData)
      throw new Error(`Sensor subType not supported ${subType || 'FALSEY'}\n${json}`)
    }

    return new FoundClass(sensorData)
  }

  static new(functionalityData) {
    return FunctionalityFactory.newFromSubType(functionalityData)
  }

}

module.exports = FunctionalityFactory
