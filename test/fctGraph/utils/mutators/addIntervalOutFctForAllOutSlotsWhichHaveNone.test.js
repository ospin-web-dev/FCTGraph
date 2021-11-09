const FCTGraphSeeder = require('seeders/fctGraph/FCTGraphSeeder')
const IntervalOut = require('functionalities/IntervalOut')
const addIntervalOutFctForAllOutSlotsWhichHaveNone = require('fctGraph/Utils/mutators/addIntervalOutFctForAllOutSlotsWhichHaveNone')

describe('addIntervalOutFctForAllOutSlotsWhichHaveNone', () => {

  afterAll(() => {
    jest.restoreAllMocks()
  })

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
      { fctData: { destination } },
    )

    const intervalOutNodes = fctGraph.functionalities.filter(fct => (
      !fctIdsPreInsertion.includes(fct.id)
    ))

    expect(intervalOutNodes.length).toBeGreaterThan(0)
    intervalOutNodes.forEach(intervalOutNode => {
      expect(intervalOutNode.destination.name).toBe(destination.name)
    })
  })

  it('shows a warning when "customData" is used', () => {
    const spy = jest.spyOn(global.console, 'warn').mockImplementation(() => {})
    const fctGraph = FCTGraphSeeder.seedOne()

    addIntervalOutFctForAllOutSlotsWhichHaveNone(
      fctGraph,
      { customData: { name: 'putin-spy' } },
    )

    expect(spy).toHaveBeenCalledWith(expect.stringMatching(/key is deprecated/))
  })

  it('sets the slot name correctly', () => {
    const fctGraph = FCTGraphSeeder.seedOne()
    const fctIdsPreInsertion = fctGraph.functionalities.map(fct => fct.id)

    addIntervalOutFctForAllOutSlotsWhichHaveNone(fctGraph)

    const intervalOutNodes = fctGraph.functionalities.filter(fct => (
      !fctIdsPreInsertion.includes(fct.id)
    ))

    expect(intervalOutNodes.length).toBeGreaterThan(0)
    intervalOutNodes.forEach(intervalOutNode => {
      expect(intervalOutNode.slots[0].name).toBe(IntervalOut.SLOT_NAME)
    })
  })
})
