const Joi = require('joi')
const ArrayUtils = require('@choux/array-utils')
const { v4: uuidv4 } = require('uuid')

const JOIous = require('mixins/instanceMixins/JOIous')
const RegexUtils = require('utils/RegexUtils')
const FunctionalityFactory = require('functionalities/factories/FunctionalityFactory')
const AddFunctionalityError = require('./AddFunctionalityError')

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
  _addFunctionalityAndAssertStructure(fctData) {
    const newFct = FunctionalityFactory.new({ id: uuidv4(), ...fctData })
    this.functionalities.push(newFct)
    this.assertStructure()
  }

  _addFunctionalityOrThrow(fctData) {
    const preLength = this.functionalities.length

    try {
      this._addFunctionalityAndAssertStructure(fctData)
    } catch (e) {
      const postLength = this.functionalities.length
      if (postLength > preLength) { this.functionalities.pop() }
      throw new AddFunctionalityError(fctData, e.message)
    }
  }

  addFunctionality(fctData) {
    try {
      this._addFunctionalityOrThrow(fctData)
    } catch (e) {
      return { error: true, errorMsg: e.message, functionality: fctData }
    }

    const functionality = this.functionalities[this.functionalities.length - 1]
    return { error: false, errorMsg: null, functionality }
  }

  getFctsDifference(fcts) {
    const matcher = (arr, el) => arr.some(({ id }) => id === el.id)

    return ArrayUtils.getDifference(this.functionalities, fcts, matcher)
  }

  getConnectableFctsToTargetFct(targetFct) {
    const potentialFcts = this.getFctsDifference([ targetFct ])

    return targetFct.filterConnectableFctsFromMany(potentialFcts)
  }

}

module.exports = (
  JOIous(FCTGraph)
)
