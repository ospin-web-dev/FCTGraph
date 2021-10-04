const assertFCTGraphFirstArgument = require('../helpers/assertFCTGraphFirstArgument')
const addPushOutFctForOutSlotWhichHasNone = require('./addPushOutFctForOutSlotWhichHasNone')
const addOutputFctForAllOutSlotsWhichHaveNone = require('./addOutputFctForAllOutSlotsWhichHaveNone')

function addPushOutFctForAllOutSlotsWhichHaveNone(fctGraph) {
  addOutputFctForAllOutSlotsWhichHaveNone(fctGraph, addPushOutFctForOutSlotWhichHasNone)
}

module.exports = assertFCTGraphFirstArgument(
  addPushOutFctForAllOutSlotsWhichHaveNone,
)
