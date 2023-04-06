const Joi = require('joi')
const { v4: uuidv4 } = require('uuid')

const DataStream = require('../dataStreams/DataStream')

const TYPES = {
  IN_SLOT: 'InSlot',
  OUT_SLOT: 'OutSlot',
}

const DATA_TYPES = {
  BOOLEAN: 'boolean',
  INTEGER: 'integer',
  FLOAT: 'float',
  ONE_OF: 'oneOf',
  ANY: 'any',
  ANY_NUMBER: 'anyNumber'
}

const ANY_UNIT_STRING = 'any'
const UNITLESS_UNIT = '-'
const CONTROLLER_PARAMETER_DISPLAY_TYPE = 'controller parameter'

const SCHEMA = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().valid(...Object.values(TYPES)).required(),
  displayType: Joi.string().allow(null).default(null),
  dataStreams: Joi.array().items(DataStream.SCHEMA).default([]),
  unit: Joi.string().required(),
  dataType: Joi.string().valid(...Object.values(DATA_TYPES)).required(),
  defaultValue: Joi.when('type', {
    is: TYPES.IN_SLOT,
    then: Joi.when('dataType', {
      switch: [
        {
          is: DATA_TYPES.INTEGER,
          then: Joi
            .when('min', {
              is: Joi.number().strict(),
              then: Joi.number().strict().integer().min(Joi.ref('min')),
            })
            .when('max', {
              is: Joi.number().strict(),
              then: Joi.number().strict().integer().max(Joi.ref('max')),
            }),
        },
        {
          is: DATA_TYPES.ANY,
          then: Joi
            .when('min', {
              is: Joi.exist(),
              then: Joi.number().strict().integer().min(Joi.ref('min')).allow(null),
            })
            .when('max', {
              is: Joi.exist(),
              then: Joi.number().strict().integer().max(Joi.ref('max')).allow(null),
            }),
        }, {
          is: DATA_TYPES.ANY_NUMBER,
          then: Joi
            .when('min', {
              is: Joi.exist(),
              then: Joi.number().strict().min(Joi.ref('min')).allow(null),
            })
            .when('max', {
              is: Joi.exist(),
              then: Joi.number().strict().max(Joi.ref('max')).allow(null),
            }),
        },
        {
          is: DATA_TYPES.FLOAT,
          then: Joi
            .when('min', {
              is: Joi.number().strict(),
              then: Joi.number().strict().min(Joi.ref('min')),
            })
            .when('max', {
              is: Joi.number().strict(),
              then: Joi.number().strict().max(Joi.ref('max')),
            }),
        },
        {
          is: DATA_TYPES.BOOLEAN,
          then: Joi.boolean().strict(),
        },
        {
          is: DATA_TYPES.ONE_OF,
          then: Joi.any().valid(Joi.in('selectOptions')),
        },
      ],
    }).allow(null),
    otherwise: Joi.forbidden(),
  }),

  /* oneOf type specific */

  selectOptions: Joi
    .when('type', {
      is: TYPES.IN_SLOT,
      then: Joi.when('dataType', {
        is: DATA_TYPES.ONE_OF,
        then: Joi.array().required(),
        otherwise: Joi.forbidden(),
      }),
      otherwise: Joi.forbidden(),
    }),

  /* integer/float type specific */

  min: Joi.when('type', {
    is: TYPES.IN_SLOT,
    then: Joi.when('dataType', {
      switch: [
        {
          is: DATA_TYPES.INTEGER,
          then: Joi.number().integer().strict().allow(null),
        },
        {
          is: DATA_TYPES.FLOAT,
          then: Joi.number().strict().allow(null),
        },
        {
          is: DATA_TYPES.ANY,
          then: Joi.number().integer().strict().allow(null),
        }, {
          is: DATA_TYPES.ANY_NUMBER,
          then: Joi.number().allow(null),
          otherwise: Joi.forbidden(),
        },
      ],
    }),
    otherwise: Joi.forbidden(),
  }),

  max: Joi.when('type', {
    is: TYPES.IN_SLOT,
    then: Joi.when('dataType', {
      switch: [
        {
          is: DATA_TYPES.INTEGER,
          then: Joi.when('min', {
            is: Joi.number().strict(),
            then: Joi.number().integer().min(Joi.ref('min')),
          }),
        },
        {
          is: DATA_TYPES.FLOAT,
          then: Joi.when('min', {
            is: Joi.number().strict(),
            then: Joi.number().min(Joi.ref('min')),
          }),
        },
        {
          is: DATA_TYPES.ANY,
          then: Joi.when('min', {
            is: Joi.number().strict(),
            then: Joi.number().integer().min(Joi.ref('min')),
          }),
        }, {
          is: DATA_TYPES.ANY_NUMBER,
          then: Joi.when('min', {
            is: Joi.number().strict(),
            then: Joi.number().min(Joi.ref('min')),
          }),
          otherwise: Joi.forbidden(),
        },
      ],
    }),
    otherwise: Joi.forbidden(),
  }),

  tareable: Joi.when('type', {
    is: TYPES.IN_SLOT,
    then: Joi
      .when('dataType', {
        is: Joi.alternatives().try(DATA_TYPES.INTEGER, DATA_TYPES.FLOAT),
        then: Joi.boolean().default(false),
        otherwise: Joi.forbidden(),
      }),
    otherwise: Joi.forbidden(),
  }),
})

const create = data => Joi.attempt(data, SCHEMA)

const isEmpty = slot => slot.dataStreams.length === 0

const isUnitless = slot => slot.unit === UNITLESS_UNIT

const isNumericSlot = slot => [DATA_TYPES.INTEGER,DATA_TYPES.FLOAT].includes(slot.dataType)

const isControllerParameter = slot => slot.displayType === CONTROLLER_PARAMETER_DISPLAY_TYPE

const connectsToFctSlot = (slot, fctId, slotName) => (
  slot.dataStreams.some(ds => DataStream.connectsToFctSlot(ds, fctId, slotName))
)

const getOutGoingDataStreams = (slot, fctId) => (
  slot.dataStreams
    .filter(ds => ds.sourceSlotName === slot.name && ds.sourceFctId === fctId)
)

const getIncomingDataStreams = (slot, fctId) => (
  slot.dataStreams
    .filter(ds => ds.sinkSlotName === slot.name && ds.sinkFctId === fctId)
)

const _assertSlotDataTypesCompatible = (slotA, slotB) => {

  const isCompatible = slotA.dataType === slotB.dataType
    || [slotA.dataType,slotB.dataType].includes(DATA_TYPES.ANY)
    || isNumericSlot(slotA) && slotB.dataType === DATA_TYPES.ANY_NUMBER
    || isNumericSlot(slotB) && slotA.dataType === DATA_TYPES.ANY_NUMBER

  if (
    !isCompatible
  ) {
    throw new Error('dataTypes must match between slots')
  }
}

const _assertSlotUnitsCompatible = (slotA, slotB) => {
  if (
    slotA.unit !== slotB.unit
    && slotA.unit !== ANY_UNIT_STRING
    && slotB.unit !== ANY_UNIT_STRING
  ) {
    throw new Error('units must match between slots')
  }
}

const _assertSlotTypesCompatible = (slotA, slotB) => {
  if (slotA.type === slotB.type) {
    throw new Error('slots must have complimentary types')
  }
}

const areConnected = (slotA, slotB) => (
  slotA.dataStreams.some(dsA => slotB.dataStreams.some(dsB => dsB.id === dsA.id))
)

const _assertConnectionBetweenSlotsDoesntAlreadyExit = (slotA, slotB) => {
  if (areConnected(slotA, slotB)) {
    throw new Error('slots are already connected')
  }
}

const _assertHasRoomForConnectionTo = slot => {
  if (slot.type === TYPES.IN_SLOT) {
    if (slot.dataStreams.length > 0) {
      throw new Error(`${slot.type} can only have a single dataStream`)
    }
  }
}

const assertConnectionBetweenIsPossible = (slotA, slotB) => {
  _assertSlotDataTypesCompatible(slotA, slotB)
  _assertSlotUnitsCompatible(slotA, slotB)
  _assertSlotTypesCompatible(slotA, slotB)
  _assertConnectionBetweenSlotsDoesntAlreadyExit(slotA, slotB)
  _assertHasRoomForConnectionTo(slotB)
  _assertHasRoomForConnectionTo(slotA)
}

const _addDataStream = (slot, dataStream) => ({
  ...slot,
  dataStreams: [
    ...slot.dataStreams,
    dataStream,
  ],
})

const getAveragingWindowSize = (slotA, slotB) => {
  const dataTypeToAveragingWindowSize = {
    [DATA_TYPES.INTEGER]: 0,
    [DATA_TYPES.FLOAT]: 0,
    [DATA_TYPES.BOOLEAN]: 1,
    [DATA_TYPES.ONE_OF]: 1,
    [DATA_TYPES.ANY]: 1,
  }

  if (slotA.dataType === DATA_TYPES.ANY) {
    return dataTypeToAveragingWindowSize[slotB.dataType]
  }

  return dataTypeToAveragingWindowSize[slotA.dataType]
}

const createDataStreamTo = (
  thisFct,
  thisSlot,
  otherFct,
  otherSlot,
  dataStreamData,
) => {

  let fromFct
  let fromSlot
  let toFct
  let toSlot

  if (thisSlot.type === TYPES.OUT_SLOT) {
    fromFct = thisFct
    fromSlot = thisSlot
    toFct = otherFct
    toSlot = otherSlot
  } else {
    fromFct = otherFct
    fromSlot = otherSlot
    toFct = thisFct
    toSlot = thisSlot
  }

  return DataStream.create({
    id: uuidv4(),
    sinkFctId: toFct.id,
    sinkSlotName: toSlot.name,
    sourceFctId: fromFct.id,
    sourceSlotName: fromSlot.name,
    averagingWindowSize: getAveragingWindowSize(fromSlot, toSlot),
    ...dataStreamData,
  })
}

const connectTo = (thisSlot, otherSlot, dataStream) => {
  const updatedThisSlot = _addDataStream(thisSlot, dataStream)
  const updatedOtherSlot = _addDataStream(otherSlot, dataStream)
  return { updatedThisSlot, updatedOtherSlot }
}

module.exports = {
  TYPES,
  DATA_TYPES,
  ANY_UNIT_STRING,
  UNITLESS_UNIT,
  CONTROLLER_PARAMETER_DISPLAY_TYPE,
  SCHEMA,
  create,
  isEmpty,
  isUnitless,
  isControllerParameter,
  connectsToFctSlot,
  getOutGoingDataStreams,
  getIncomingDataStreams,
  areConnected,
  assertConnectionBetweenIsPossible,
  getAveragingWindowSize,
  createDataStreamTo,
  connectTo,
}
