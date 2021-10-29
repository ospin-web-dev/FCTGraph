const FCTGraphSeeder = require('seeders/fctGraph/FCTGraphSeeder')
const IntervalOut = require('functionalities/IntervalOut')
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

  it('sets the desired destination if one is provided', () => {
    const destination = { name: 'ospin-webapp' }
    const fctGraph = FCTGraphSeeder.seedOne()
    const fctIdsPreInsertion = fctGraph.functionalities.map(fct => fct.id)

    addIntervalOutFctForAllOutSlotsWhichHaveNone(
      fctGraph,
      { customData: { destination } },
    )

    const intervalOutNodes = fctGraph.functionalities.filter(fct => (
      !fctIdsPreInsertion.includes(fct.id)
    ))

    expect(intervalOutNodes.length).toBeGreaterThan(0)
    intervalOutNodes.forEach(intervalOutNode => {
      expect(intervalOutNode.destination.name).toBe(destination.name)
    })
  })

  it('sets the slot name correctly', () => {
    const destination = { name: 'ospin-webapp' }
    const fctGraph = FCTGraphSeeder.seedOne()
    const fctIdsPreInsertion = fctGraph.functionalities.map(fct => fct.id)

    addIntervalOutFctForAllOutSlotsWhichHaveNone(
      fctGraph,
      { customData: { destination } },
    )

    const intervalOutNodes = fctGraph.functionalities.filter(fct => (
      !fctIdsPreInsertion.includes(fct.id)
    ))

    expect(intervalOutNodes.length).toBeGreaterThan(0)
    intervalOutNodes.forEach(intervalOutNode => {
      expect(intervalOutNode.slots[0].name).toBe(IntervalOut.SLOT_NAME)
    })
  })
})
