const assertFCTGraphFirstArgument = require('../helpers/assertFCTGraphFirstArgument')
const addIntervalOutFctForOutSlotWhichHasNone = require('./addIntervalOutFctForOutSlotWhichHasNone')
const addOutputFctForAllOutSlotsWhichHaveNone = require('./addOutputFctForAllOutSlotsWhichHaveNone')

function addIntervalOutFctForAllOutSlotsWhichHaveNone(fctGraph) {
  addOutputFctForAllOutSlotsWhichHaveNone(fctGraph, addIntervalOutFctForOutSlotWhichHasNone)
}

module.exports = assertFCTGraphFirstArgument(
  addIntervalOutFctForAllOutSlotsWhichHaveNone,
)
