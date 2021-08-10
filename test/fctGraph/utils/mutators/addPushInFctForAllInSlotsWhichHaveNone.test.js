const FCTGraphSeeder = require('seeders/fctGraph/FCTGraphSeeder')
const addPushInFctForAllInSlotsWhichHaveNone = require('fctGraph/Utils/mutators/addPushInFctForAllInSlotsWhichHaveNone')

describe('addPushInFctForAllInSlotsWhichHaveNone', () => {

  it('adds a PushOut fct for all out slots which have none', () => {
    const fctGraph = FCTGraphSeeder.seedOne()

    const preFctsLength = fctGraph.functionalities.length
    const inSlots = fctGraph.functionalities.reduce((slots, functionality) => (
      slots.concat(functionality.inSlots)
    ), [])

    const inSlotsWithoutInputNodes = inSlots.filter(inSlot => (
      !inSlot.isConnectedToInputnode
    ))

    addPushInFctForAllInSlotsWhichHaveNone(fctGraph)

    expect(fctGraph.functionalities).toHaveLength(
      preFctsLength + inSlotsWithoutInputNodes.length,
    )
  })

})
