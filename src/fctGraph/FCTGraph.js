const Joi = require('joi')
const ArrayUtils = require('@choux/array-utils')
const { v4: uuidv4 } = require('uuid')

const JOIous = require('../mixins/instanceMixins/JOIous')
const FunctionalityFactory = require('../functionalities/factories/FunctionalityFactory')
const RegexUtils = require('../utils/RegexUtils')
const { publicSuccessRes, publicErrorRes } = require('../utils/publicResponses')
const AddFunctionalityError = require('./AddFunctionalityError')

class FCTGraph {

  static get SCHEMA() {
    return Joi.object({
      id: Joi.string().pattern(RegexUtils.UUIDV4).required(),
      functionalities: Joi.array().items(Joi.alternatives().try(
        ...FunctionalityFactory.SUPPORTED_CLASSES_SCHEMAS,
      )),
    })
  }

  constructor({
    id,
    functionalities,
  }) {
    this.id = id
    // Avoid blowing up in the constructor if non-array given for fcts. Joi will give a better error
    this.functionalities = Array.isArray(functionalities)
      ? functionalities.map(FunctionalityFactory.new)
      : []
  }

  serialize() {
    return {
      id: this.id,
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

    return newFct
  }

  _addFunctionalityOrThrow(fctData) {
    const preLength = this.functionalities.length

    try {
      const newFct = this._addFunctionalityAndAssertStructure(fctData)
      return newFct
    } catch (e) {
      const postLength = this.functionalities.length
      if (postLength > preLength) { this.functionalities.pop() }
      throw new AddFunctionalityError(fctData, e.message)
    }
  }

  // safe - returns a public response
  addFunctionality(fctData) {
    try {
      const functionality = this._addFunctionalityOrThrow(fctData)
      return publicSuccessRes({ functionality })
    } catch (e) {
      return publicErrorRes({ errorMsg: e.message, functionality: fctData })
    }
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
