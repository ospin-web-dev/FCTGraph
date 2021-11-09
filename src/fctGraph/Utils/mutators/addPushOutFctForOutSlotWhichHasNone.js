const assertFCTGraphFirstArgument = require('../helpers/assertFCTGraphFirstArgument')
const addOutputFctForOutSlotWhichHasNone = require('./addOutputFctForOutSlotWhichHasNone')
const PushOut = require('../../../functionalities/PushOut')

const DEFAULT_OPTS = {
  fctData: {},
  inSlotData: {},
}

function addPushOutFctForOutSlotWhichHasNone(fctGraph, outSlot, opts = DEFAULT_OPTS) {
  return addOutputFctForOutSlotWhichHasNone(fctGraph, outSlot, PushOut, opts)
}

module.exports = assertFCTGraphFirstArgument(
  addPushOutFctForOutSlotWhichHasNone,
)
