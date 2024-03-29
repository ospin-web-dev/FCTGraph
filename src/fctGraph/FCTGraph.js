const Joi = require('joi')
const deepClone = require('deep-clone')
const ArrayUtils = require('../utils/ArrayUtils')
const Functionality = require('../functionalities/Functionality')
const Slot = require('../slots/Slot')
const DataStream = require('../dataStreams/DataStream')
const RegexUtils = require('../utils/RegexUtils')

const SCHEMA = Joi.object({
  id: Joi.string().pattern(RegexUtils.UUIDV4).required(),
  deviceId: Joi.string().pattern(RegexUtils.UUIDV4).required(),
  deviceDefault: Joi.boolean().strict().default(false),
  name: Joi.string().min(1).max(255).required(),
  functionalities: Joi.array().items(Functionality.SCHEMA).default([]),
  imageURL: Joi.string().default(null).allow(null),
  templateId: Joi.string().pattern(RegexUtils.UUIDV4).default(null).allow(null),
})

const create = data => Joi.attempt(data, SCHEMA)

const update = (fctGraph, data) => ({ ...fctGraph, ...data })

const addFunctionality = (fctGraph, fct) => (
  update(fctGraph, {
    functionalities: [
      ...fctGraph.functionalities,
      fct,
    ],
  })
)

const getFctByQuery = (fctGraph, query) => (
  fctGraph.functionalities.find(fct => (
    Object.keys(query).every(key => query[key] === fct[key])
  ))
)

const getFctById = (fctGraph, fctId) => (
  getFctByQuery(fctGraph, { id: fctId })
)

const getFctByPosId = (fctGraph, posId) => (
  getFctByQuery(fctGraph, { posId })
)

const getFctsWithoutIONodes = fctGraph => (
  fctGraph.functionalities.filter(fct => (
    fct.type !== Functionality.FIXED_TYPES.INPUT_NODE
      && fct.type !== Functionality.FIXED_TYPES.OUTPUT_NODE
  ))
)

const getFctsByQuery = (fctGraph, query) => (
  fctGraph.functionalities.filter(fct => (
    Object.keys(query).every(key => query[key] === fct[key])
  ))
)

const getFctsByType = (fctGraph, targetType) => (
  getFctsByQuery(fctGraph, { type: targetType })
)

const getFctsBySubType = (fctGraph, targetSubType) => (
  getFctsByQuery(fctGraph, { subType: targetSubType })
)

const getPushInFcts = fctGraph => (
  getFctsBySubType(fctGraph, Functionality.FIXED_SUB_TYPES.PUSH_IN)
)

const getIntervalOutFcts = fctGraph => (
  getFctsBySubType(fctGraph, Functionality.FIXED_SUB_TYPES.INTERVAL_OUT)
)

const getPhysicalFcts = fctGraph => (
  getFctsByQuery(fctGraph, { isVirtual: false })
)

const getVirtualFcts = fctGraph => (
  getFctsByQuery(fctGraph, { isVirtual: true })
)

const getAllDataStreams = fctGraph => (
  Array.from(
    fctGraph.functionalities.reduce((graphDataStreams, fct) => (
      [ ...graphDataStreams, ...Functionality.getAllDataStreams(fct) ]
    ), []),
  )
)

const getAllUniqueDataStreams = fctGraph => {
  /* because datastreams are duplciated on the connected slots */
  const allDs = getAllDataStreams(fctGraph)

  return allDs.reduce((uniqueDs, currDs) => {
    if (uniqueDs.some(ds => ds.id === currDs.id)) {
      return uniqueDs
    }
    return [ ...uniqueDs, currDs ]
  }, [])
}

const getConnectedFctsForFct = (fctGraph, fctId) => {
  const fct = getFctById(fctGraph, fctId)
  const otherFctsIds = Functionality.getConnectedFctIds(fct)

  return otherFctsIds.map(id => getFctById(fctGraph, id))
}

const getConnectedSourcesForFct = (fctGraph, fctId) => {
  const fct = getFctById(fctGraph, fctId)
  const sourceFctIds = Functionality.getConnectedSourceFctIds(fct)

  return sourceFctIds.map(id => getFctById(fctGraph, id))
}

const getConnectedSinksForFct = (fctGraph, fctId) => {
  const fct = getFctById(fctGraph, fctId)
  const sinkFctIds = Functionality.getConnectedSinkFctIds(fct)

  return sinkFctIds.map(id => getFctById(fctGraph, id))
}

const getSinkFct = (fctGraph, fctId) => {
  const fct = getFctById(fctGraph, fctId)
  if (!Functionality.isInputNode(fct)) {
    throw new Error(`This method is only allowed for ${Functionality.FIXED_TYPES.INPUT_NODE}`)
  }
  return getConnectedSinksForFct(fctGraph, fctId)[0]
}

const getConnectingSinkSlot = (fctGraph, fctId) => {
  const fct = getFctById(fctGraph, fctId)
  const sink = getSinkFct(fctGraph, fctId)
  if (!sink) return
  return Functionality
    .getSlotByName(sink, Functionality.getAllDataStreams(fct)[0].sinkSlotName)
}

const getSourceFct = (fctGraph, fctId) => {
  const fct = getFctById(fctGraph, fctId)
  if (!Functionality.isOutputNode(fct)) {
    throw new Error(`This method is only allowed for ${Functionality.FIXED_TYPES.OUTPUT_NODE}`)
  }
  return getConnectedSourcesForFct(fctGraph, fctId)[0]
}

const getConnectingSourceSlot = (fctGraph, fctId) => {
  const fct = getFctById(fctGraph, fctId)
  const source = getSourceFct(fctGraph, fctId)
  if (!source) return
  return Functionality
    .getSlotByName(source, Functionality.getAllDataStreams(fct)[0].sourceSlotName)
}

const getReporterFctIdForSlot = (fctGraph, fctId, slotName) => {
  const fct = getFctById(fctGraph, fctId)
  const slot = Functionality.getSlotByName(fct, slotName)

  const candidateIds = Slot
    .getOutGoingDataStreams(slot, fctId)
    .map(ds => ds.sinkFctId)

  if (!candidateIds.length) return null

  const reporter = fctGraph.functionalities.find(candidateFct => (
    candidateFct.subType === Functionality.FIXED_SUB_TYPES.INTERVAL_OUT
      && candidateIds.includes(candidateFct.id)
  ))

  return reporter ? reporter.id : null
}

const getInputNodeFctIdForSlot = (fctGraph, fctId, slotName) => {
  const fct = getFctById(fctGraph, fctId)
  const slot = Functionality.getSlotByName(fct, slotName)

  const candidateIds = Slot
    .getIncomingDataStreams(slot, fctId)
    .map(ds => ds.sourceFctId)

  if (!candidateIds.length) return null

  const inputNode = fctGraph.functionalities.find(candidateFct => (
    candidateFct.subType === Functionality.FIXED_SUB_TYPES.PUSH_IN
      && candidateIds.includes(candidateFct.id)
  ))

  return inputNode ? inputNode.id : null
}

const getConnectedSlotsForSlot = (fctGraph, fctId, slotName) => {
  const fcts = getConnectedFctsForFct(fctGraph, fctId)

  return fcts.reduce((slots, currFct) => ([
    ...slots,
    ...currFct.slots.filter(slot => Slot.connectsToFctSlot(slot, fctId, slotName)),
  ]), [])
}

const getConnectedFctsForSlot = (fctGraph, fctId, slotName) => {
  const fcts = getConnectedFctsForFct(fctGraph, fctId)
  return fcts.filter(fct => Functionality.connectsToFctSlot(fct, fctId, slotName))
}

const slotIsConnectedToOutputNode = (fctGraph, fctId, slotName) => {
  const fcts = getConnectedFctsForSlot(fctGraph, fctId, slotName)
  return fcts.some(fct => fct.type === Functionality.FIXED_TYPES.OUTPUT_NODE)
}

const slotIsConnectedToInputNode = (fctGraph, fctId, slotName) => {
  const fcts = getConnectedFctsForSlot(fctGraph, fctId, slotName)
  return fcts.some(fct => fct.type === Functionality.FIXED_TYPES.INPUT_NODE)
}

const requirePublishIntervalMsAdjustment = (fctA, fctB) => (
  fctA.subType === Functionality.FIXED_SUB_TYPES.INTERVAL_OUT
    && ('outputIntervalMs' in fctB)
)

const connect = (
  fctGraph,
  thisFctId,
  thisSlotName,
  otherFctId,
  otherSlotName,
  dataStreamData = {},
) => {
  const thisFct = getFctById(fctGraph, thisFctId)
  const otherFct = getFctById(fctGraph, otherFctId)
  const thisSlot = Functionality.getSlotByName(thisFct, thisSlotName)
  const otherSlot = Functionality.getSlotByName(otherFct, otherSlotName)

  Slot.assertConnectionBetweenIsPossible(thisSlot, otherSlot)
  const dataStream = Slot
    .createDataStreamTo(thisFct, thisSlot, otherFct, otherSlot, dataStreamData)
  const { updatedThisSlot, updatedOtherSlot } = Slot.connectTo(thisSlot, otherSlot, dataStream)

  let updatedThisFct = Functionality
    .updateSlotByName(thisFct, thisSlot.name, updatedThisSlot)
  let updatedOtherFct = Functionality
    .updateSlotByName(otherFct, otherSlot.name, updatedOtherSlot)

  if (requirePublishIntervalMsAdjustment(updatedThisFct, updatedOtherFct)) {
    const { outputIntervalMs } = updatedOtherFct
    updatedThisFct = Functionality
      .update(updatedThisFct, { publishIntervalMs: outputIntervalMs })
  }

  if (requirePublishIntervalMsAdjustment(updatedOtherFct, updatedThisFct)) {
    const { outputIntervalMs } = updatedThisFct
    updatedOtherFct = Functionality
      .update(updatedOtherFct, { publishIntervalMs: outputIntervalMs })
  }

  return update(fctGraph, {
    functionalities: fctGraph.functionalities.map(fct => {
      if (fct.id === updatedThisFct.id) return updatedThisFct
      if (fct.id === updatedOtherFct.id) return updatedOtherFct
      return fct
    }),
  })
}

const populatePushInNodes = fctGraph => {
  /* add PushIn nodes for every InSlot that is empty */

  const slotsWithoutPushIns = fctGraph.functionalities.reduce((res, currFct) => ([
    ...res,
    ...currFct.slots
      .filter(slot => slot.type === Slot.TYPES.IN_SLOT)
      .filter(slot => Slot.isEmpty(slot))
      .filter(slot => !slotIsConnectedToInputNode(fctGraph, currFct.id, slot.name))
      .map(slot => ({ slotName: slot.name, fctId: currFct.id })),
  ]), [])

  const pushInNodes = Array
    .from({ length: slotsWithoutPushIns.length }, Functionality.createPushIn)

  const graphWithPushIns = pushInNodes.reduce((graph, pushIn) => (
    addFunctionality(graph, pushIn)
  ), fctGraph)

  return slotsWithoutPushIns.reduce((graph, { slotName, fctId }, idx) => (
    connect(
      graph,
      fctId,
      slotName,
      pushInNodes[idx].id,
      pushInNodes[idx].slots[0].name,
    )
  ), graphWithPushIns)
}

const populateIntervalOutNodes = fctGraph => {
  /* add IntervalOut nodes for every OutSlot that is empty */

  const slotsWithoutIntervalOuts = fctGraph.functionalities.reduce((res, currFct) => ([
    ...res,
    ...currFct.slots
      .filter(slot => slot.type === Slot.TYPES.OUT_SLOT)
      .filter(slot => Slot.isEmpty(slot))
      .filter(slot => !slotIsConnectedToOutputNode(fctGraph, currFct.id, slot.name))
      .map(slot => ({ slotName: slot.name, fctId: currFct.id })),
  ]), [])

  const intervalOutNodes = Array
    .from({ length: slotsWithoutIntervalOuts.length }, Functionality.createIntervalOut)

  const graphWithIntervalOuts = intervalOutNodes.reduce((graph, intervalOut) => (
    addFunctionality(graph, intervalOut)
  ), fctGraph)

  return slotsWithoutIntervalOuts.reduce((graph, { slotName, fctId }, idx) => (
    connect(
      graph,
      fctId,
      slotName,
      intervalOutNodes[idx].id,
      intervalOutNodes[idx].slots[0].name,
    )
  ), graphWithIntervalOuts)
}

const fctsDeepEquals = (fctGraphA, fctGraphB) => {
  if (fctGraphA.functionalities.length !== fctGraphB.functionalities.length) {
    return false
  }

  const sortedFctGraphs = [deepClone(fctGraphA), deepClone(fctGraphB)].map(fctGraph => {
    const sortedFcts = ArrayUtils.sortObjectsByKeyValue(fctGraph.functionalities, 'id')
    const fctsWithSortedSlots = sortedFcts.map(fct => {
      fct.slots = ArrayUtils.sortObjectsByKeyValue(fct.slots, 'name') //eslint-disable-line
      return fct
    })
    return fctsWithSortedSlots
  })

  return !sortedFctGraphs[0]
    .some((fct, index) => !Functionality.isDeepEqual(fct, sortedFctGraphs[1][index]))
}

const removeFunctionality = (fctGraph, fctId) => {
  const graphWithoutFct = update(fctGraph, {
    functionalities: fctGraph.functionalities.filter(fct => fct.id !== fctId),
  })

  /* removing all connections to that fct */
  return update(graphWithoutFct, {
    functionalities: graphWithoutFct.functionalities.map(fct => ({
      ...fct,
      slots: fct.slots.map(slot => ({
        ...slot,
        dataStreams: slot.dataStreams.filter(ds => !DataStream.connectsFct(ds, fctId)),
      })),
    })),
  })
}

const removeIntervalOutNode = (fctGraph, fctId, slotName) => {
  const intervalOutFctId = getReporterFctIdForSlot(fctGraph, fctId, slotName)
  return removeFunctionality(fctGraph, intervalOutFctId)
}

const removePushInNode = (fctGraph, fctId, slotName) => {
  const pushInFctId = getInputNodeFctIdForSlot(fctGraph, fctId, slotName)
  return removeFunctionality(fctGraph, pushInFctId)
}

module.exports = {
  SCHEMA,
  create,
  update,
  addFunctionality,
  getFctByQuery,
  getFctById,
  getFctByPosId,
  getFctsWithoutIONodes,
  getFctsByQuery,
  getFctsByType,
  getFctsBySubType,
  getPushInFcts,
  getIntervalOutFcts,
  getPhysicalFcts,
  getVirtualFcts,
  getAllDataStreams,
  getAllUniqueDataStreams,
  getConnectedFctsForFct,
  getConnectedSourcesForFct,
  getConnectedSinksForFct,
  getSinkFct,
  getConnectingSinkSlot,
  getSourceFct,
  getConnectingSourceSlot,
  getReporterFctIdForSlot,
  getInputNodeFctIdForSlot,
  getConnectedSlotsForSlot,
  getConnectedFctsForSlot,
  slotIsConnectedToOutputNode,
  slotIsConnectedToInputNode,
  connect,
  populatePushInNodes,
  populateIntervalOutNodes,
  fctsDeepEquals,
  removeFunctionality,
  removeIntervalOutNode,
  removePushInNode,
}
