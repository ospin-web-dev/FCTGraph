const FunctionalityFactory = require('./factories/FunctionalityFactory')

// base type
const Functionality = require('./Functionality')

// types inherit from Functionality
const Sensor = require('./Sensor')
const Actuator = require('./Actuator')
const Controller = require('./Controller')
const InputNode = require('./InputNode')
const OutputNode = require('./OutputNode')

// sub-types which inherit from types
const UnknownSensor = require('./UnknownSensor')
const UnknownActuator = require('./UnknownActuator')
const TemperatureSensor = require('./TemperatureSensor')
const StirrerActuator = require('./StirrerActuator')
const PumpActuator = require('./PumpActuator')
const HeaterActuator = require('./HeaterActuator')
const IntervalOut = require('./IntervalOut')
const PIDController = require('./PIDController')
const HysteresisController = require('./HysteresisController')
const PushOut = require('./PushOut')
const PushIn = require('./PushIn')

// sub-types which inherit from other sub-types
const HeidolphOverheadStirrer = require('./HeidolphOverheadStirrer')
const HeidolphMagneticStirrer = require('./HeidolphMagneticStirrer')
const HeidolphPump = require('./HeidolphPump')
const HeidolphPumpByTorqueHysteresisController = require('./HeidolphPumpByTorqueHysteresisController')

module.exports = {
  FunctionalityFactory,
  // base type
  Functionality,

  // types inherit from Functionality (invalid fcts)
  Sensor,
  Actuator,
  Controller,
  InputNode,
  OutputNode,

  // sub-types which inherit from types (valid fcts)
  StirrerActuator,
  PumpActuator,
  TemperatureSensor,
  UnknownSensor,
  UnknownActuator,
  HeaterActuator,
  IntervalOut,
  PIDController,
  PushOut,
  PushIn,
  HysteresisController,

  // sub-types which inherit from other sub-types (valid fcts)
  HeidolphOverheadStirrer,
  HeidolphMagneticStirrer,
  HeidolphPump,
  HeidolphPumpByTorqueHysteresisController,
}
