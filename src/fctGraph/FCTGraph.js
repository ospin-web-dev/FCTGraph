const Joi = require('joi')
const ArrayUtils = require('@choux/array-utils')
const { v4: uuidv4 } = require('uuid')

const JOIous = require('../mixins/instanceMixins/JOIous')
const FunctionalityFactory = require('../functionalities/factories/FunctionalityFactory')
const InputNode = require('../functionalities/InputNode')
const OutputNode = require('../functionalities/OutputNode')
const PushOut = require('../functionalities/PushOut')
const IntervalOut = require('../functionalities/IntervalOut')
const PushIn = require('../functionalities/PushIn')
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

  static _collectUniqueDataStreamsDataFromFctData(functionalitiesData) {
    const uniqueDataStreamsDataById = {}

    functionalitiesData.forEach(({ slots }) => {
      slots.forEach(({ dataStreams = [] }) => {
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

  _addManyConnectionsViaDataStreamsData(dataStreamsData) {
    dataStreamsData.forEach(dataStreamData => (
      this._addConnectionViaDataStreamData(dataStreamData)
    ))
  }

  _populateConnectionsFromFctData(functionalitiesData) {
    const dataStreamsData = FCTGraph._collectUniqueDataStreamsDataFromFctData(functionalitiesData)

    this._addManyConnectionsViaDataStreamsData(dataStreamsData)
  }

  constructor({
    id = uuidv4(),
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
    functionalitiesData.map(fctData => this._addFunctionalityByData(fctData))
    this._populateConnectionsFromFctData(functionalitiesData)
  }

  static newWithDataStreamsTopLevel({ dataStreams: dataStreamsData, ...newData }) {
    /* this method is a helper for FW who wants to make use of a top level
     * dataStreams key as opposed to using the dataStreams data nested down
     * in the slots */
    if (!Array.isArray(dataStreamsData)) throw Error('key of "dataStreams" must be present and an array')

    const fctGraph = new FCTGraph(newData)
    fctGraph._addManyConnectionsViaDataStreamsData(dataStreamsData)

    return fctGraph
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
    return newFct
  }

  _addFunctionalityByData(fctData) {
    const newFct = FunctionalityFactory.new({ ...fctData })
    this._addFunctionality(newFct)
    return newFct
  }

  addFunctionality(newFct) {
    this._addFunctionality(newFct)
    return publicSuccessRes({ functionality: newFct })
  }

  addFunctionalityByData(fctData) {
    try {
      const newFct = FunctionalityFactory.newAndAssertStructure(fctData)
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

  getInputFcts() {
    return this.functionalities.filter(({ type }) => type === InputNode.TYPE)
  }

  getPushInFcts() {
    return this.getInputFcts().filter(({ subType }) => subType === PushIn.SUB_TYPE)
  }

  getInputFctsBySourceName(sourceName) {
    return this.getInputFcts().filter(({ source: { name } }) => name === sourceName)
  }

  getOutputFcts() {
    return this.functionalities.filter(({ type }) => type === OutputNode.TYPE)
  }

  getPushOutFcts() {
    return this.getOutputFcts().filter(({ subType }) => subType === PushOut.SUB_TYPE)
  }

  getOutputFctsByDestinationName(destinationName) {
    return this.getOutputFcts().filter(({ destination: { name } }) => name === destinationName)
  }

  getIntervalOutFcts() {
    return this.getOutputFcts().filter(({ subType }) => subType === IntervalOut.SUB_TYPE)
  }

  getFctById(fctId) {
    return this.functionalities.find(({ id }) => id === fctId)
  }

  getSlotByFctIdAndSlotName(fctId, slotName) {
    const fct = this.getFctById(fctId)
    return fct && fct.getSlotByName(slotName)
  }

  get dataStreams() {
    return Array.from(
      this.functionalities.reduce((graphDataStreams, { dataStreams }) => (
        new Set([ ...graphDataStreams, ...dataStreams ])
      ), new Set()),
    )
  }

  get dataStreamsCount() {
    return this.dataStreams.length
  }

  disconnectAll() { this.functionalities.forEach(fct => fct.disconnectAll()) }

}

module.exports = (
  JOIous(FCTGraph)
)
