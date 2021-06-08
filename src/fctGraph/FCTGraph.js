const Joi = require('joi')

const JOIous = require('mixins/instanceMixins/JOIous')
const RegexUtils = require('utils/RegexUtils')
const FunctionalityFactory = require('functionalities/factories/FunctionalityFactory')

class FCTGraph {

  static get SCHEMA() {
    return Joi.object({
      id: Joi.string().pattern(RegexUtils.UUIDV4).required(),
      deviceId: Joi.string().pattern(RegexUtils.UUIDV4).required(),
      deviceDefault: Joi.boolean().default(false),
      functionalities: Joi.array().items(Joi.alternatives().try(
        ...FunctionalityFactory.SUPPORTED_CLASSES_SCHEMAS,
      )).default([]),
    })
  }

  constructor({
    id,
    deviceId,
    deviceDefault,
    functionalities,
  }) {
    this.id = id
    this.deviceId = deviceId
    this.deviceDefault = deviceDefault
    // Avoids blowing up in the constructor. Joi gives better errors
    this.functionalities = Array.isArray(functionalities)
      ? functionalities.map(FunctionalityFactory.new)
      : []
  }

  serialize() {
    return {
      id: this.id,
      deviceId: this.deviceId,
      deviceDefault: this.deviceDefault,
      functionalities: this.functionalities.map(func => func.serialize()),
    }
  }

  /* *******************************************************************
   * GRAPH ACTIONS
   * **************************************************************** */
  getFctsDifference(fcts) {
    const fctIds = fcts.map(({ id }) => id)

    return this.functionalities.filter(({ id }) => (
    ))
  }

  getConnectableFctsToTargetFct(targetFct) {
    const potentialFcts = this.getFctsDifference([ targetFct ])
    console.warn({ targetFct, potentialFcts })

    return targetFct.filterConnectableFctsFromMany(potentialFcts)
  }

}

module.exports = (
  JOIous(FCTGraph)
)