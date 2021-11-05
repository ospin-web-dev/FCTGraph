// sub-types which inherit from types
const UnknownSensorSeeder = require('./UnknownSensorSeeder')
const UnknownActuatorSeeder = require('./UnknownActuatorSeeder')
const TemperatureSensorSeeder = require('./TemperatureSensorSeeder')
const StirrerActuatorSeeder = require('./StirrerActuatorSeeder')
const PumpActuatorSeeder = require('./PumpActuatorSeeder')
const HeaterActuatorSeeder = require('./HeaterActuatorSeeder')
const IntervalOutSeeder = require('./IntervalOutSeeder')
const PIDControllerSeeder = require('./PIDControllerSeeder')
const PushOutSeeder = require('./PushOutSeeder')
const PushInSeeder = require('./PushInSeeder')
const HysteresisControllerSeeder = require('./HysteresisControllerSeeder')

// sub-types which inherit from other sub-types
const HeidolphOverheadStirrerSeeder = require('./HeidolphOverheadStirrerSeeder')
const HeidolphMagneticStirrerSeeder = require('./HeidolphMagneticStirrerSeeder')
const HeidolphPumpSeeder = require('./HeidolphPumpSeeder')
const HeidolphPumpByTorqueHysteresisControllerSeeder = require('./HeidolphPumpByTorqueHysteresisControllerSeeder')

module.exports = {
  // sub-types which inherit from types (valid fcts)
  StirrerActuatorSeeder,
  PumpActuatorSeeder,
  TemperatureSensorSeeder,
  UnknownSensorSeeder,
  UnknownActuatorSeeder,
  HeaterActuatorSeeder,
  IntervalOutSeeder,
  PIDControllerSeeder,
  PushOutSeeder,
  PushInSeeder,
  HysteresisControllerSeeder,

  // sub-types which inherit from other sub-types (valid fcts)
  HeidolphOverheadStirrerSeeder,
  HeidolphMagneticStirrerSeeder,
  HeidolphPumpSeeder,
  HeidolphPumpByTorqueHysteresisControllerSeeder,
}
