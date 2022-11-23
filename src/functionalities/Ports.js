const Joi = require('joi')
const Port = require('./Port')

const SCHEMA = Joi.array().items(Port.SCHEMA).default([])

/* even though "ports" is an array, functionalities
 * are always associated with a single port which
 * is wrapped in an array - so this is a convenience function
 * because most of the time we operate on this array */
const getId = ports => Port.getId(ports[0])

const areEqual = (portsA, portsB) => (
  getId(portsA) === getId(portsB)
)

const areDifferent = (portsA, portsB) => (
  !areEqual(portsA, portsB)
)

module.exports = {
  areEqual,
  areDifferent,
  getId,
  SCHEMA,
  PORT_SCHEMA: Port.SCHEMA,
}
