const { v4: uuidv4 } = require('uuid')
const assertFCTGraphFirstArgument = require('../helpers/assertFCTGraphFirstArgument')
const InSlot = require('../../../slots/InSlot')
const OutSlot = require('../../../slots/OutSlot')
const OutputNode = require('../../../functionalities/OutputNode')

function assertIsOutSlot(slot) {
  if (!(slot instanceof OutSlot)) {
    throw new Error(`${slot} must be of type ${OutSlot.TYPE}`)
  }
}

function assertSlotsFctExists(slot) {
  const slotsParentFctExists = !!slot.functionality

  if (!slotsParentFctExists) {
    throw new Error(`${slot} parent fct can not be found by in the fctGraph`)
  }
}

function assertDoesNotHaveConnectedOutputNode(slot) {
  if (slot.isConnectedToOutputNode) {
    throw new Error(`${slot} already has a connected OutputNode`)
  }
}

function assertPrerequisites(fctGraph, outSlot) {
  assertIsOutSlot(outSlot)
  assertSlotsFctExists(outSlot)
  assertDoesNotHaveConnectedOutputNode(outSlot)
}

function safeAddOutputFctAndConnect(fctGraph, outSlot, outputFct) {
  fctGraph.addFunctionality(outputFct)
  const addConnectionResponse = outSlot.connectTo(outputFct.inSlots[0])

  return addConnectionResponse
}

function addOutputFctForOutSlotWhichHasNone(fctGraph, outSlot, SubTypeClass, opts) {
  assertPrerequisites(fctGraph, outSlot)

  if ('customData' in opts) {
    throw new Error('"customData" key is no longer supported. Please use "fctData" instead')
  }

  const functionalityId = uuidv4()

  const inSlotData = {
    type: InSlot.TYPE,
    dataType: outSlot.dataType,
    name: OutputNode.SLOT_NAME,
    displayType: outSlot.displayType,
    unit: OutSlot.ANY_UNIT_STRING,
    dataStreams: [],
  }

  const outputFct = SubTypeClass.assertValidDataAndNew({
    id: functionalityId,
    type: SubTypeClass.TYPE,
    subType: SubTypeClass.SUB_TYPE,
    name: 'Output',
    ...opts.customData,
    ...opts.fctData,
    slots: [ inSlotData ],
  })

  return safeAddOutputFctAndConnect(fctGraph, outSlot, outputFct)
}

module.exports = assertFCTGraphFirstArgument(
  addOutputFctForOutSlotWhichHasNone,
)
