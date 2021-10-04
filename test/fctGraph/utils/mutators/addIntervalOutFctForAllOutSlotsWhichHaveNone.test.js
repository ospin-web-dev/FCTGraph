const FCTGraphSeeder = require('seeders/fctGraph/FCTGraphSeeder')
const addIntervalOutFctForAllOutSlotsWhichHaveNone = require('fctGraph/Utils/mutators/addIntervalOutFctForAllOutSlotsWhichHaveNone')

describe('addIntervalOutFctForAllOutSlotsWhichHaveNone', () => {

  it('adds a IntervalOut fct for all out slots which have none', () => {
    const fctGraph = FCTGraphSeeder.seedOne()

    const preFctsLength = fctGraph.functionalities.length
    const outSlots = fctGraph.functionalities.reduce((slots, functionality) => (
      slots.concat(functionality.outSlots)
    ), [])

    const outSlotsWithoutOutputNodes = outSlots.filter(outSlot => (
      !outSlot.isConnectedToOutputNode
    ))

    addIntervalOutFctForAllOutSlotsWhichHaveNone(fctGraph)

    expect(fctGraph.functionalities).toHaveLength(
      preFctsLength + outSlotsWithoutOutputNodes.length,
    )
  })

})
