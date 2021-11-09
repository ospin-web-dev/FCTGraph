const assertFCTGraphFirstArgument = require('../helpers/assertFCTGraphFirstArgument')
const IntervalOut = require('../../../functionalities/IntervalOut')
const addOutputFctForOutSlotWhichHasNone = require('./addOutputFctForOutSlotWhichHasNone')

const DEFAULT_OPTS = {
  fctData: {},
  inSlotData: {},
}

function addIntervalOutFctForOutSlotWhichHasNone(fctGraph, outSlot, opts = DEFAULT_OPTS) {
  return addOutputFctForOutSlotWhichHasNone(fctGraph, outSlot, IntervalOut, opts)
}

module.exports = assertFCTGraphFirstArgument(
  addIntervalOutFctForOutSlotWhichHasNone,
)
