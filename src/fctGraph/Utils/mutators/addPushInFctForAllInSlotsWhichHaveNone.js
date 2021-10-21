const assertFCTGraphFirstArgument = require('../helpers/assertFCTGraphFirstArgument')
const addPushInFctForInSlotWhichHasNone = require('./addPushInFctForInSlotWhichHasNone')

function isValidSlot(slot) {
  return (
    slot.isEmpty
    && slot.isInSlot
    && !slot.isConnectedToInputnode
  )
}

function addPushInFctForAllInSlotsWhichHaveNone(fctGraph, options) {
  fctGraph.functionalities.forEach(({ slots }) => {
    slots.forEach(slot => {
      if (isValidSlot(slot)) {
        addPushInFctForInSlotWhichHasNone(fctGraph, slot, options)
      }
    })
  })
}

module.exports = assertFCTGraphFirstArgument(
  addPushInFctForAllInSlotsWhichHaveNone,
)
