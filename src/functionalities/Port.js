const Joi = require('joi')

const SCHEMA = Joi.object({
  name: Joi.string().required(),
  purpose: Joi.string().required(),
  // some devices share a port, so they have to be internally distinguished within the port
  unitId: Joi.string(),
})

const getId = port => {
  const { name, unitId } = port
  if (unitId) return `${name}-${unitId}`
  return name
}

module.exports = {
  getId,
  SCHEMA,
}
