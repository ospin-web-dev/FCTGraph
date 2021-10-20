const assertFCTGraphFirstArgument = require('../helpers/assertFCTGraphFirstArgument')

function isValidSlot(slot) {
  return (
    slot.isEmpty
    && slot.isOutSlot
    && !slot.isConnectedToOutputNode
  )
}

function addOutputFctForAllOutSlotsWhichHaveNone(fctGraph, addNodeMutationFunction, options) {
  fctGraph.functionalities.forEach(({ slots }) => {
    slots.forEach(slot => {
      if (isValidSlot(slot)) {
        addNodeMutationFunction(fctGraph, slot, options)
      }
    })
  })
}

module.exports = assertFCTGraphFirstArgument(
  addOutputFctForAllOutSlotsWhichHaveNone,
)
