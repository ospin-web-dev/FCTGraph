const FCTGraphSeeder = require('seeders/fctGraph/FCTGraphSeeder')
const addPushOutFctForAllOutSlotsWhichHaveNone = require('fctGraph/Utils/mutators/addPushOutFctForAllOutSlotsWhichHaveNone')

describe('addPushOutFctForAllOutSlotsWhichHaveNone', () => {

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('adds a PushOut fct for all out slots which have none', () => {
    const fctGraph = FCTGraphSeeder.seedOne()

    const preFctsLength = fctGraph.functionalities.length
    const outSlots = fctGraph.functionalities.reduce((slots, functionality) => (
      slots.concat(functionality.outSlots)
    ), [])

    const outSlotsWithoutOutputNodes = outSlots.filter(outSlot => (
      !outSlot.isConnectedToOutputNode
    ))

    addPushOutFctForAllOutSlotsWhichHaveNone(fctGraph)

    expect(fctGraph.functionalities).toHaveLength(
      preFctsLength + outSlotsWithoutOutputNodes.length,
    )
  })

  it('shows a warning when "customData" is used', () => {
    const spy = jest.spyOn(global.console, 'warn').mockImplementation(() => {})
    const fctGraph = FCTGraphSeeder.seedOne()

    addPushOutFctForAllOutSlotsWhichHaveNone(
      fctGraph,
      { customData: { name: 'putin-spy' } },
    )

    expect(spy).toHaveBeenCalledWith(expect.stringMatching(/key is deprecated/))
  })
})
