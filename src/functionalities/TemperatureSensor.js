const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const Sensor = require('./Sensor')

class TemperatureSensor extends Sensor {

  static get SUB_TYPE() {
    return 'TemperatureSensor'
  }

  static get SCHEMA() {
    return Joi.object({
      subType: Joi.string().allow(TemperatureSensor.TYPE).required(),
    }).concat(super.SCHEMA)
  }

  constructor(sensorData) {
    super(sensorData)
    this.subType = TemperatureSensor.SUB_TYPE
  }

  serialize() {
    return {
      ...super.serialize(),
      subType: this.subType,
    }
  }

}

module.exports = (
  JOIous(TemperatureSensor)
)
