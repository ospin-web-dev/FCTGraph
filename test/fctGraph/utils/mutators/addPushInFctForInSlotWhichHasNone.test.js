const FCTGraphSeeder = require('seeders/fctGraph/FCTGraphSeeder')
const { HeaterActuatorSeeder, PushInSeeder } = require('seeders/functionalities')
const { PushIn } = require('functionalities')
const { IntegerInSlotSeeder, IntegerOutSlotSeeder } = require('seeders/slots')

const addPushInFctForInSlotWhichHasNone = require('fctGraph/Utils/mutators/addPushInFctForInSlotWhichHasNone')

describe('addPushInFctForInSlotWhichHasNone', () => {

  afterAll(() => {
    jest.restoreAllMocks()
  })

  describe('given invalid arguments', () => {
    it('throws error if the first argument is not a fctGraph instance', () => {
      const fctGraphData = FCTGraphSeeder.generate()
      const inSlot = IntegerInSlotSeeder.seedOne()

      expect(
        () => addPushInFctForInSlotWhichHasNone(fctGraphData, inSlot),
      ).toThrow(/the first argument must be an instance of fctGraph/)
    })

    it('throws error if the slot\'s parent fct can not be found on the fctGraph', () => {
      const fctGraph = FCTGraphSeeder.seedOne()
      const inSlot = IntegerInSlotSeeder.seedOne()

      expect(
        () => addPushInFctForInSlotWhichHasNone(fctGraph, inSlot),
      ).toThrow(/parent fct can not be found/)
    })

    it('throws error if the slot is not an inslot', () => {
      const fctGraph = FCTGraphSeeder.seedOne()
      const outSlot = IntegerOutSlotSeeder.seedOne()

      expect(
        () => addPushInFctForInSlotWhichHasNone(fctGraph, outSlot),
      ).toThrow(/must be of type InSlot/)
    })

    it('throws error if the slot already has a connected InputNode fct', () => {
      const fctGraph = FCTGraphSeeder.seedOne({
        functionalities: [
          HeaterActuatorSeeder.generateKelvinHeater(),
          PushInSeeder.generateFloatPushInKelvin(),
        ],
      })

      const [ heaterActuator, pushInFct ] = fctGraph.functionalities
      heaterActuator.inSlots[0].connectTo(pushInFct.outSlots[0])

      expect(
        () => addPushInFctForInSlotWhichHasNone(fctGraph, heaterActuator.inSlots[0]),
      ).toThrow(/already has a connected InputNode/)
    })

    describe('when the addition of the new functionality fails at the connection', () => {
      it('returns something that looks enough like a public error response', () => {
        const fctGraph = FCTGraphSeeder.seedOne({
          functionalities: [
            HeaterActuatorSeeder.generate(),
          ],
        })

        const heatActuator = fctGraph.functionalities[0]
        const heatActuatorInSlot = heatActuator.getInSlots()[0]
        const errorMsg = 'no!'
        heatActuatorInSlot._connectTo = () => { throw new Error(errorMsg) }

        expect(() => addPushInFctForInSlotWhichHasNone(fctGraph, heatActuatorInSlot))
          .toThrow(errorMsg)
      })
    })
  })

  describe('given valid arguments', () => {
    it('adds a corresponding pushIn fct, which is connected to the inSlot', () => {
      const fctGraph = FCTGraphSeeder.seedOne({
        functionalities: [
          HeaterActuatorSeeder.generate(),
        ],
      })

      const heatActuator = fctGraph.functionalities[0]
      const heatActuatorInSlot = heatActuator.getInSlots()[0]

      expect(fctGraph.functionalities).toHaveLength(1)

      addPushInFctForInSlotWhichHasNone(fctGraph, heatActuatorInSlot)

      expect(fctGraph.functionalities).toHaveLength(2)

      const [ heaterActuator, pushIn ] = fctGraph.functionalities
      expect(heaterActuator.isConnectedToFct(pushIn)).toBe(true)
    })

    it('sets the desired source if one is provided', () => {
      const source = { name: 'ospin-webapp' }
      const fctGraph = FCTGraphSeeder.seedOne({
        functionalities: [
          HeaterActuatorSeeder.generate(),
        ],
      })

      const heatActuator = fctGraph.functionalities[0]
      const heatActuatorInSlot = heatActuator.getInSlots()[0]

      addPushInFctForInSlotWhichHasNone(
        fctGraph,
        heatActuatorInSlot,
        { fctData: { source } },
      )

      const pushInNodes = fctGraph.getPushInFcts()

      expect(pushInNodes).toHaveLength(1)
      expect(pushInNodes[0].source.name).toBe(source.name)
    })

    it('sets the correct slot name', () => {
      const source = { name: 'ospin-webapp' }
      const fctGraph = FCTGraphSeeder.seedOne({
        functionalities: [
          HeaterActuatorSeeder.generate(),
        ],
      })

      const heatActuator = fctGraph.functionalities[0]
      const heatActuatorInSlot = heatActuator.getInSlots()[0]

      addPushInFctForInSlotWhichHasNone(
        fctGraph,
        heatActuatorInSlot,
        { fctData: { source } },
      )

      const pushInNodes = fctGraph.getPushInFcts()

      expect(pushInNodes).toHaveLength(1)
      expect(pushInNodes[0].slots[0].name).toBe(PushIn.SLOT_NAME)
    })

    it('throws when "customData" is used', () => {
      const fctGraph = FCTGraphSeeder.seedOne({
        functionalities: [
          HeaterActuatorSeeder.generate(),
        ],
      })

      const heatActuator = fctGraph.functionalities[0]
      const heatActuatorInSlot = heatActuator.getInSlots()[0]

      expect(() => {
        addPushInFctForInSlotWhichHasNone(
          fctGraph,
          heatActuatorInSlot,
          { customData: { name: 'putin-spy' } },
        )
      }).toThrow(/"customData" key is no longer supported/)
    })
  })
})
