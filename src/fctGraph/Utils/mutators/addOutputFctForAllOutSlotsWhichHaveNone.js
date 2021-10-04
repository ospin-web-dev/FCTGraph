const assertFCTGraphFirstArgument = require('../helpers/assertFCTGraphFirstArgument')

function isValidSlot(slot) {
  return (
    slot.isEmpty
    && slot.isOutSlot
    && !slot.isConnectedToOutputNode
  )
}

function addOutputFctForAllOutSlotsWhichHaveNone(fctGraph, addNodeMutationFunction) {
  fctGraph.functionalities.forEach(({ slots }) => {
    slots.forEach(slot => {
      if (isValidSlot(slot)) {
        addNodeMutationFunction(fctGraph, slot)
      }
    })
  })
}

module.exports = assertFCTGraphFirstArgument(
  addOutputFctForAllOutSlotsWhichHaveNone,
)
