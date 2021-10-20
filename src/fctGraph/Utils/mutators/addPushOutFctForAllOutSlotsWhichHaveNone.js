const assertFCTGraphFirstArgument = require('../helpers/assertFCTGraphFirstArgument')
const addPushOutFctForOutSlotWhichHasNone = require('./addPushOutFctForOutSlotWhichHasNone')
const addOutputFctForAllOutSlotsWhichHaveNone = require('./addOutputFctForAllOutSlotsWhichHaveNone')

function addPushOutFctForAllOutSlotsWhichHaveNone(fctGraph, options) {
  addOutputFctForAllOutSlotsWhichHaveNone(fctGraph, addPushOutFctForOutSlotWhichHasNone, options)
}

module.exports = assertFCTGraphFirstArgument(
  addPushOutFctForAllOutSlotsWhichHaveNone,
)
