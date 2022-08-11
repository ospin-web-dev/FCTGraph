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
const DataStream = require('../dataStreams/DataStream')
const RegexUtils = require('../utils/RegexUtils')
const { publicSuccessRes, publicErrorRes } = require('../utils/publicResponses')

class FCTGraph {

  static get SCHEMA() {
    return Joi.object({
      id: Joi.string().pattern(RegexUtils.UUIDV4),
      deviceId: Joi.string().pattern(RegexUtils.UUIDV4).required(),
      deviceDefault: Joi.boolean().strict(),
      name: Joi.string().min(1).max(255).required(),
      functionalities: Joi.array().items(Joi.alternatives().try(
        ...FunctionalityFactory.SUPPORTED_CLASSES_SCHEMAS,
      )),
      dataStreams: Joi.array().items(DataStream.SCHEMA),
    })
  }

  static collectUniqueDataStreamsDataFromFctData(functionalitiesData) {
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
    const dataStreamsData = FCTGraph.collectUniqueDataStreamsDataFromFctData(functionalitiesData)

    this._addManyConnectionsViaDataStreamsData(dataStreamsData)
  }

  constructor({
    id = uuidv4(),
    deviceId,
    functionalities: functionalitiesData = [],
    deviceDefault = false,
    name,
    dataStreams: dataStreamsData = [],
  }) {
    this.id = id
    this.deviceId = deviceId
    this.name = name
    this.deviceDefault = deviceDefault
    this.functionalities = []
    functionalitiesData.map(fctData => this._addFunctionalityByData({ ...fctData, fctGraph: this }))

    // NOTE: update readme with this
    if (dataStreamsData.length > 0) {
      this._addManyConnectionsViaDataStreamsData(dataStreamsData)
    } else {
      this._populateConnectionsFromFctData(functionalitiesData)
    }
  }

  static newWithDataStreamsTopLevel(newData) {
    // DEPRECATED: keep for legacy firmware reasons
    return this.assertValidDataAndNew(newData)
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
      const newFct = FunctionalityFactory.assertValidDataAndNew(fctData)
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

  getOutputFcts() {
    return this.functionalities.filter(({ type }) => type === OutputNode.TYPE)
  }

  getPushOutFcts() {
    return this.getOutputFcts().filter(({ subType }) => subType === PushOut.SUB_TYPE)
  }

  getIONodeFcts() {
    return [...this.getInputFcts(), ...this.getOutputFcts()]
  }

  getIntervalOutFcts() {
    return this.getOutputFcts().filter(({ subType }) => subType === IntervalOut.SUB_TYPE)
  }

  getFctById(fctId) {
    return this.functionalities.find(({ id }) => id === fctId)
  }

  getFctsByName(fctName) {
    return this.functionalities.filter(({ name }) => name === fctName)
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

  fctsDeepEquals(fctGraphB) {
    if (this.functionalities.length !== fctGraphB.functionalities.length) {
      return false
    }
    const sortedFctGraphs = [this.clone(), fctGraphB.clone()].map(fctGraph => {
      const sortedFcts = ArrayUtils.sortObjectsByKeyValue(fctGraph.functionalities, 'id')
      const fctsWithSortedSlots = sortedFcts.map(fct => {
        fct.slots = ArrayUtils.sortObjectsByKeyValue(fct.slots, 'name') //eslint-disable-line
        return fct
      })
      return fctsWithSortedSlots
    })

    return !sortedFctGraphs[0].some((fct, index) => !fct.isDeepEqual(sortedFctGraphs[1][index]))
  }

  disconnectAll() { this.functionalities.forEach(fct => fct.disconnectAll()) }

  _removeFct(fctToBeRemoved) {
    fctToBeRemoved.disconnectAll()
    const fctIndex = this.functionalities.findIndex(fct => fct.id === fctToBeRemoved.id)
    if (fctIndex === -1) {
      throw Error('Fct can not be found on the graph')
    }
    this.functionalities.splice(fctIndex, 1)
    return publicSuccessRes({ removedFct: fctToBeRemoved })
  }

  removeFct(fct) {
    try {
      return this._removeFct(fct)
    } catch (e) {
      return publicErrorRes({ errorMsg: e.message, functionality: fct })
    }
  }

  getDisconnectedIONodeFcts() {
    const fcts = this.getIONodeFcts()
    return fcts.filter(fct => !fct.isConnected)
  }

}

module.exports = (
  JOIous(FCTGraph)
)
