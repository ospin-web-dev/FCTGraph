const assertFCTGraphFirstArgument = require('../helpers/assertFCTGraphFirstArgument')
const addIntervalOutFctForOutSlotWhichHasNone = require('./addIntervalOutFctForOutSlotWhichHasNone')
const addOutputFctForAllOutSlotsWhichHaveNone = require('./addOutputFctForAllOutSlotsWhichHaveNone')

function addIntervalOutFctForAllOutSlotsWhichHaveNone(fctGraph, options) {
  addOutputFctForAllOutSlotsWhichHaveNone(
    fctGraph,
    addIntervalOutFctForOutSlotWhichHasNone,
    options,
  )
}

module.exports = assertFCTGraphFirstArgument(
  addIntervalOutFctForAllOutSlotsWhichHaveNone,
)
