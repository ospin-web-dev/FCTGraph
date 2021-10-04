const { v4: uuidv4 } = require('uuid')

const assertFCTGraphFirstArgument = require('../helpers/assertFCTGraphFirstArgument')
const InSlot = require('../../../slots/InSlot')
const OutSlot = require('../../../slots/OutSlot')

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

function safeAddPushOutAndConnect(fctGraph, outSlot, pushOutFct) {
  fctGraph.addFunctionality(pushOutFct)
  const addConnectionResponse = outSlot.connectTo(pushOutFct.inSlots[0])

  return addConnectionResponse
}

function addOutputFctForOutSlotWhichHasNone(fctGraph, outSlot, subTypeClass, opts) {
  assertPrerequisites(fctGraph, outSlot)

  const functionalityId = uuidv4()

  const inSlotData = {
    type: InSlot.TYPE,
    dataType: outSlot.dataType,
    name: outSlot.name,
    functionalityId,
    displayType: outSlot.displayType,
    unit: outSlot.unit,
    dataStreams: [],
  }

  const outputFct = subTypeClass.newAndAssertStructure({
    id: functionalityId,
    name: 'Output',
    ...opts.pushOutData,
    slots: [ inSlotData ],
  })

  return safeAddPushOutAndConnect(fctGraph, outSlot, outputFct)
}

module.exports = assertFCTGraphFirstArgument(
  addOutputFctForOutSlotWhichHasNone,
)
