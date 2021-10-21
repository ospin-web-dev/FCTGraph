const { v4: uuidv4 } = require('uuid')

const assertFCTGraphFirstArgument = require('../helpers/assertFCTGraphFirstArgument')
const PushIn = require('../../../functionalities/PushIn')
const InSlot = require('../../../slots/InSlot')
const OutSlot = require('../../../slots/OutSlot')

function assertIsInSlot(slot) {
  if (!(slot instanceof InSlot)) {
    throw new Error(`${slot} must be of type ${InSlot.TYPE}`)
  }
}

function assertSlotsFctExists(slot) {
  const slotsParentFctExists = !!slot.functionality

  if (!slotsParentFctExists) {
    throw new Error(`${slot} parent fct can not be found by in the fctGraph`)
  }
}

function assertDoesNotHaveConnectedInputNode(slot) {
  if (slot.isConnectedToInputNode) {
    throw new Error(`${slot} already has a connected InputNode`)
  }
}

function assertPrerequisites(fctGraph, inSlot) {
  assertIsInSlot(inSlot)
  assertSlotsFctExists(inSlot)
  assertDoesNotHaveConnectedInputNode(inSlot)
}

function safeAddPushInAndConnect(fctGraph, inSlot, pushInFct) {
  fctGraph.addFunctionality(pushInFct)
  const addConnectionResponse = inSlot.connectTo(pushInFct.outSlots[0])

  return addConnectionResponse
}

const DEFAULT_OPTS = {
  customData: {},
}

function addPushInFctForInSlotWhichHasNone(fctGraph, inSlot, opts = DEFAULT_OPTS) {
  assertPrerequisites(fctGraph, inSlot)

  const functionalityId = uuidv4()

  const outSlotData = {
    type: OutSlot.TYPE,
    dataType: inSlot.dataType,
    name: inSlot.name,
    functionalityId,
    displayType: inSlot.displayType,
    unit: inSlot.unit,
    dataStreams: [],
  }

  const pushInFct = PushIn.newAndAssertStructure({
    id: functionalityId,
    name: 'Push In',
    ...opts.customData,
    slots: [ outSlotData ],
  })

  return safeAddPushInAndConnect(fctGraph, inSlot, pushInFct)
}

module.exports = assertFCTGraphFirstArgument(
  addPushInFctForInSlotWhichHasNone,
)
