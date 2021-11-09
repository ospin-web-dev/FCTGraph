const FCTGraphSeeder = require('seeders/fctGraph/FCTGraphSeeder')
const PushIn = require('functionalities/PushIn')
const addPushInFctForAllInSlotsWhichHaveNone = require('fctGraph/Utils/mutators/addPushInFctForAllInSlotsWhichHaveNone')

describe('addPushInFctForAllInSlotsWhichHaveNone', () => {

  afterAll(() => {
    jest.restoreAllMocks()
  })

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

  it('sets the desired source if one is provided', () => {
    const source = { name: 'ospin-webapp' }
    const fctGraph = FCTGraphSeeder.seedOne()
    const fctIdsPreInsertion = fctGraph.functionalities.map(fct => fct.id)

    addPushInFctForAllInSlotsWhichHaveNone(
      fctGraph,
      { fctData: { source } },
    )

    const pushInNodes = fctGraph.functionalities.filter(fct => (
      !fctIdsPreInsertion.includes(fct.id)
    ))

    expect(pushInNodes.length).toBeGreaterThan(0)
    pushInNodes.forEach(pushInNode => {
      expect(pushInNode.source.name).toBe(source.name)
    })
  })

  it('shows a warning when "customData" is used', () => {
    const spy = jest.spyOn(global.console, 'warn').mockImplementation(() => {})
    const fctGraph = FCTGraphSeeder.seedOne()

    addPushInFctForAllInSlotsWhichHaveNone(
      fctGraph,
      { customData: { name: 'putin-spy' } },
    )

    expect(spy).toHaveBeenCalledWith(expect.stringMatching(/key is deprecated/))
  })

  it('sets the correct slot name', () => {
    const fctGraph = FCTGraphSeeder.seedOne()
    const fctIdsPreInsertion = fctGraph.functionalities.map(fct => fct.id)

    addPushInFctForAllInSlotsWhichHaveNone(fctGraph)

    const pushInNodes = fctGraph.functionalities.filter(fct => (
      !fctIdsPreInsertion.includes(fct.id)
    ))

    expect(pushInNodes.length).toBeGreaterThan(0)
    pushInNodes.forEach(pushInNode => {
      expect(pushInNode.slots[0].name).toBe(PushIn.SLOT_NAME)
    })
  })
})
