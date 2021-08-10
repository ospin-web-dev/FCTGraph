const Joi = require('joi')
const ArrayUtils = require('@choux/array-utils')

const JOIous = require('../mixins/instanceMixins/JOIous')
const FunctionalityFactory = require('../functionalities/factories/FunctionalityFactory')
const InputNode = require('../functionalities/InputNode')
const OutputNode = require('../functionalities/OutputNode')
const RegexUtils = require('../utils/RegexUtils')
const { publicSuccessRes, publicErrorRes } = require('../utils/publicResponses')

class FCTGraph {

  static get SCHEMA() {
    return Joi.object({
      id: Joi.string().pattern(RegexUtils.UUIDV4).required(),
      deviceId: Joi.string().pattern(RegexUtils.UUIDV4).required(),
      deviceDefault: Joi.boolean().strict().required(),
      name: Joi.string().min(1).max(255).required(),
      functionalities: Joi.array().items(Joi.alternatives().try(
        ...FunctionalityFactory.SUPPORTED_CLASSES_SCHEMAS,
      )).required(),
    })
  }

  static _collectUniqueDataStreamsData(functionalitiesData) {
    const uniqueDataStreamsDataById = {}

    functionalitiesData.forEach(({ slots }) => {
      slots.forEach(({ dataStreams }) => {
        dataStreams.forEach(dataStream => {
          uniqueDataStreamsDataById[dataStream.id] = dataStream
        })
      })
    })

    // sandwich iteration, but for readability!
    return Object.values(uniqueDataStreamsDataById)
  }

  _addConnectionViaDataStreamData(dataStreamData) {
    const {
      sourceFctId,
      sourceSlotName,
      sinkFctId,
      sinkSlotName,
    } = dataStreamData

    const sourceSlot = this.getSlotByFctIdAndSlotName(sourceFctId, sourceSlotName)
    const sinkSlot = this.getSlotByFctIdAndSlotName(sinkFctId, sinkSlotName)

    sourceSlot.connectTo(sinkSlot, dataStreamData)
  }

  _populateConnections(functionalitiesData) {
    const dataStreamsData = FCTGraph._collectUniqueDataStreamsData(functionalitiesData)

    dataStreamsData.forEach(dataStreamData => (
      this._addConnectionViaDataStreamData(dataStreamData)
    ))
  }

  constructor({
    id,
    deviceId,
    functionalities: functionalitiesData = [],
    deviceDefault = false,
    name,
  }) {
    this.id = id
    this.deviceId = deviceId
    this.name = name
    this.deviceDefault = deviceDefault
    this.functionalities = []
    functionalitiesData.map(fctData => this._addFunctionalityByDataOrThrow(fctData))
    this._populateConnections(functionalitiesData)
  }

  serialize() {
    return {
      id: this.id,
      deviceId: this.deviceId,
      name: this.name,
      deviceDefault: this.deviceDefault,
      functionalities: this.functionalities.map(func => func.serialize()),
    }
  }

  /* *******************************************************************
   * GRAPH ACTIONS
   * **************************************************************** */
  _addFunctionality(newFct) {
    this.functionalities.push(newFct)
  }

  _addFunctionalityByDataOrThrow(fctData) {
    const newFct = FunctionalityFactory.new({ ...fctData, fctGraph: this })
    this._addFunctionality(newFct)
  }

  addFunctionality(newFct) {
    this._addFunctionality(newFct)
    return publicSuccessRes({ functionality: newFct })
  }

  addFunctionalityByData(fctData) {
    try {
      const newFct = FunctionalityFactory.new(fctData)
      return this.addFunctionality(newFct)
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

  getFctsWithoutIONodes() {
    return this.functionalities.filter(fct => (
      fct.type !== InputNode.TYPE && fct.type !== OutputNode.TYPE
    ))
  }

  getFctById(fctId) {
    return this.functionalities.find(({ id }) => id === fctId)
  }

  getSlotByFctIdAndSlotName(fctId, slotName) {
    const fct = this.getFctById(fctId)
    return fct && fct.getSlotByName(slotName)
  }

  get dataStreamsCount() {
    return this.functionalities.reduce((dataStreamsCount, fct) => (
      dataStreamsCount + fct.dataStreamsCount
    ), 0)
  }

}

module.exports = (
  JOIous(FCTGraph)
)
