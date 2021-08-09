const assertFCTGraphFirstArgument = require('../helpers/assertFCTGraphFirstArgument')
const addPushInFctForInSlotWhichHasNone = require('./addPushInFctForInSlotWhichHasNone')

function isValidSlot(slot) {
  return (
    slot.isEmpty
    && slot.isInSlot
    && !slot.isConnectedToInputnode
  )
}

function addPushInFctForAllInSlotsWhichHaveNone(fctGraph) {
  fctGraph.functionalities.forEach(({ slots }) => {
    slots.forEach(slot => {
      if (isValidSlot(slot)) {
        addPushInFctForInSlotWhichHasNone(fctGraph, slot)
      }
    })
  })
}

module.exports = assertFCTGraphFirstArgument(
  addPushInFctForAllInSlotsWhichHaveNone,
)
