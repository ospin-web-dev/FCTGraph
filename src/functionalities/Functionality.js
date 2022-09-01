const Joi = require('joi')
const { v4: uuidv4 } = require('uuid')

const RegexUtils = require('../utils/RegexUtils')
const ObjUtils = require('../utils/ObjUtils')
const Slot = require('../slots/Slot')

const FIXED_TYPES = {
  INPUT_NODE: 'InputNode',
  OUTPUT_NODE: 'OutputNode',
}

const FIXED_SUB_TYPES = {
  INTERVAL_OUT: 'IntervalOut',
  PUSH_IN: 'PushIn',
}

const PORT_SCHEMA = Joi.object({
  name: Joi.string().required(),
  purpose: Joi.string().required(),
})

const SCHEMA = Joi.object({
  id: Joi.string().pattern(RegexUtils.UUIDV4).required(),
  name: Joi.string().required(),
  type: Joi.string().required(),
  subType: Joi.string().required(),
  slots: Joi.array()
    .items(Slot.SCHEMA)
    .unique('name')
    .default([]),
  isVirtual: Joi.boolean().default(false),
  firmwareBlackBox: Joi.object(),
  outputIntervalMs: Joi.number()
    .integer()
    .strict()
    .min(0),
  ports: Joi.when(
    'isVirtual',
    {
      is: false,
      then: Joi.array().items(PORT_SCHEMA).default([]),
      otherwise: Joi.forbidden(),
    },
  ),
  publishIntervalMs: Joi.when(
    'subType',
    {
      is: FIXED_SUB_TYPES.INTERVAL_OUT,
      then: Joi.number()
        .integer()
        .strict()
        .min(1)
        .max(1000 * 60 * 60 * 24)
        .default(1000),
      otherwise: Joi.forbidden(),
    },
  ),
})

const create = data => Joi.attempt(data, SCHEMA)

const update = (fct, updateData) => ({ ...fct, ...updateData })

const updateSlotByName = (fct, slotName, updateData) => (
  update(fct, {
    slots: fct.slots.map(slot => {
      if (slot.name === slotName) return { ...slot, ...updateData }
      return slot
    }),
  })
)

const OUTPUT_NODE_SLOT_NAME = 'input'

const INPUT_NODE_SLOT_NAME = 'output'

const isInputNode = fct => fct.type === FIXED_TYPES.INPUT_NODE

const isOutputNode = fct => fct.type === FIXED_TYPES.OUTPUT_NODE

const isPhysical = fct => !fct.isVirtual

const getSlotNames = fct => fct.slots.map(({ name }) => name)

const getInSlots = fct => fct.slots.filter(({ type }) => type === Slot.TYPES.IN_SLOT)

const getOutSlots = fct => fct.slots.filter(({ type }) => type === Slot.TYPES.OUT_SLOT)

const getSlotByName = (fct, slotName) => fct.slots.find(({ name }) => name === slotName)

const getAllDataStreams = fct => (
  Array.from(
    fct.slots.reduce((fctDataStreams, { dataStreams }) => ([
      ...fctDataStreams, ...dataStreams,
    ]), []),
  )
)

const getDataStreamsCount = fct => getAllDataStreams(fct).length

const getConnectedFctIds = fct => {
  const ds = getAllDataStreams(fct)
  return ds.map(currDs => {
    const { sinkFctId, sourceFctId } = currDs
    if (sinkFctId === fct.id) return sourceFctId
    return sinkFctId
  })
}

const getConnectedSourceFctIds = fct => {
  const ds = getAllDataStreams(fct)
  return ds
    .filter(({ sourceFctId }) => sourceFctId !== fct.id)
    .map(({ sourceFctId }) => sourceFctId)
}

const getConnectedSinkFctIds = fct => {
  const ds = getAllDataStreams(fct)
  return ds
    .filter(({ sinkFctId }) => sinkFctId !== fct.id)
    .map(({ sinkFctId }) => sinkFctId)
}

const isConnectedToFct = (fct, fctId) => getConnectedFctIds(fct).some(id => id === fctId)

const connectsToFctSlot = (fct, fctId, slotName) => (
  fct.slots.some(slot => Slot.connectsToFctSlot(slot, fctId, slotName))
)

const isConnected = fct => getDataStreamsCount(fct) > 0

const isDeepEqual = (fctA, fctB) => ObjUtils.objsDeepEqual(fctA, fctB)

const createPushIn = (data = {}) => {
  const oppositeSlot = Slot.create({
    type: Slot.TYPES.OUT_SLOT,
    dataType: Slot.DATA_TYPES.ANY,
    name: INPUT_NODE_SLOT_NAME,
    unit: Slot.ANY_UNIT_STRING,
  })

  return create({
    id: uuidv4(),
    name: 'Push In',
    type: FIXED_TYPES.INPUT_NODE,
    subType: FIXED_SUB_TYPES.PUSH_IN,
    slots: [ oppositeSlot ],
    isVirtual: true,
    ...data,
  })
}

const createIntervalOut = (data = {}) => {
  const oppositeSlot = Slot.create({
    type: Slot.TYPES.IN_SLOT,
    dataType: Slot.DATA_TYPES.ANY,
    name: OUTPUT_NODE_SLOT_NAME,
    unit: Slot.ANY_UNIT_STRING,
    defaultValue: null,
  })

  return create({
    id: uuidv4(),
    name: 'Interval Out',
    type: FIXED_TYPES.OUTPUT_NODE,
    subType: FIXED_SUB_TYPES.INTERVAL_OUT,
    slots: [ oppositeSlot ],
    isVirtual: true,
    ...data,
  })
}

module.exports = {
  FIXED_TYPES,
  FIXED_SUB_TYPES,
  PORT_SCHEMA,
  SCHEMA,
  create,
  update,
  updateSlotByName,
  OUTPUT_NODE_SLOT_NAME,
  INPUT_NODE_SLOT_NAME,
  isInputNode,
  isOutputNode,
  isPhysical,
  getSlotNames,
  getInSlots,
  getOutSlots,
  getSlotByName,
  getAllDataStreams,
  getDataStreamsCount,
  getConnectedFctIds,
  getConnectedSourceFctIds,
  getConnectedSinkFctIds,
  isConnectedToFct,
  connectsToFctSlot,
  isConnected,
  isDeepEqual,
  createPushIn,
  createIntervalOut,
}
