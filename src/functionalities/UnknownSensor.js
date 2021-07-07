const Joi = require('joi')

const JOIous = require('../mixins/instanceMixins/JOIous')
const Sensor = require('./Sensor')

class UnknownSensor extends Sensor {

  static get SUB_TYPE() {
    return 'UnknownSensor'
  }

  static get SCHEMA() {
    return Joi.object({
      subType: Joi.string().allow(UnknownSensor.TYPE).required(),
    }).concat(super.SCHEMA)
  }

  constructor(sensorData) {
    super(sensorData)
    this.subType = UnknownSensor.SUB_TYPE
  }

  serialize() {
    return {
      ...super.serialize(),
      subType: this.subType,
    }
  }

}

module.exports = (
  JOIous(UnknownSensor)
)
