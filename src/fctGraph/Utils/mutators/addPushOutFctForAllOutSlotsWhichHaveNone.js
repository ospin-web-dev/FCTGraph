const assertFCTGraphFirstArgument = require('../helpers/assertFCTGraphFirstArgument')
const addPushOutFctForOutSlotWhichHasNone = require('./addPushOutFctForOutSlotWhichHasNone')

function isValidSlot(slot) {
  return (
    slot.isEmpty
    && slot.isOutSlot
    && !slot.isConnectedToOutputnode
  )
}

function addPushOutFctForAllOutSlotsWhichHaveNone(fctGraph) {
  fctGraph.functionalities.forEach(({ slots }) => {
    slots.forEach(slot => {
      if (isValidSlot(slot)) {
        addPushOutFctForOutSlotWhichHasNone(fctGraph, slot)
      }
    })
  })
}

module.exports = assertFCTGraphFirstArgument(
  addPushOutFctForAllOutSlotsWhichHaveNone,
)
