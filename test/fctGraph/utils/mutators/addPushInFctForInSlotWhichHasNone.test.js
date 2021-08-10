const FCTGraphSeeder = require('seeders/fctGraph/FCTGraphSeeder')
const { HeaterActuatorSeeder, PushInSeeder } = require('seeders/functionalities')
const { PushIn } = require('functionalities')
const { IntegerInSlotSeeder, IntegerOutSlotSeeder } = require('seeders/slots')

const addPushInFctForInSlotWhichHasNone = require('fctGraph/Utils/mutators/addPushInFctForInSlotWhichHasNone')

describe('addPushInFctForInSlotWhichHasNone', () => {

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
      const { error } = heaterActuator.inSlots[0].connectTo(pushInFct.outSlots[0])

      expect(error).toBe(false)
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

        const { error, errorMsg: receivedErrorMsg } = (
          addPushInFctForInSlotWhichHasNone(fctGraph, heatActuatorInSlot)
        )

        expect(error).toBe(true)
        expect(receivedErrorMsg).toStrictEqual(errorMsg)
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
  })

})
