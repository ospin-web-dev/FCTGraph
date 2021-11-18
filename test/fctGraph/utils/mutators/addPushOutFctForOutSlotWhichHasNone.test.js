const FCTGraphSeeder = require('seeders/fctGraph/FCTGraphSeeder')
const PushOut = require('functionalities/PushOut')
const { TemperatureSensorSeeder, PushOutSeeder } = require('seeders/functionalities')
const { IntegerInSlotSeeder, IntegerOutSlotSeeder } = require('seeders/slots')

const addPushOutFctForOutSlotWhichHasNone = require('fctGraph/Utils/mutators/addPushOutFctForOutSlotWhichHasNone')

describe('addPushOutFctForOutSlotWhichHasNone', () => {

  describe('given invalid arguments', () => {
    it('throws error if the first argument is not a fctGraph instance', () => {
      const fctGraphData = FCTGraphSeeder.generate()
      const outSlot = IntegerOutSlotSeeder.seedOne()

      expect(
        () => addPushOutFctForOutSlotWhichHasNone(fctGraphData, outSlot),
      ).toThrow(/the first argument must be an instance of fctGraph/)
    })

    it('throws error if the slot\'s parent fct can not be found on the fctGraph', () => {
      const fctGraph = FCTGraphSeeder.seedOne()
      const outSlot = IntegerOutSlotSeeder.seedOne()

      expect(
        () => addPushOutFctForOutSlotWhichHasNone(fctGraph, outSlot),
      ).toThrow(/parent fct can not be found/)
    })

    it('throws error if the slot is not an outslot', () => {
      const fctGraph = FCTGraphSeeder.seedOne()
      const inSlot = IntegerInSlotSeeder.seedOne()

      expect(
        () => addPushOutFctForOutSlotWhichHasNone(fctGraph, inSlot),
      ).toThrow(/must be of type OutSlot/)
    })

    it('throws error if the slot already has a connected OutputNode fct', () => {
      const fctGraph = FCTGraphSeeder.seedOne({
        functionalities: [
          TemperatureSensorSeeder.generateCelsiusFloatProducer(),
          PushOutSeeder.generateFloatPushOutCelsius(),
        ],
      })

      const [ temperatureSensor, pushOutFct ] = fctGraph.functionalities
      const { error } = temperatureSensor.outSlots[0].connectTo(pushOutFct.inSlots[0])

      expect(error).toBe(false)
      expect(
        () => addPushOutFctForOutSlotWhichHasNone(fctGraph, temperatureSensor.outSlots[0]),
      ).toThrow(/already has a connected OutputNode/)
    })

    describe('when the addition of the new functionality fails at the connection', () => {
      it('returns something that looks enough like a public error response', () => {
        const fctGraph = FCTGraphSeeder.seedOne({
          functionalities: [
            TemperatureSensorSeeder.generate(),
          ],
        })

        const tempSensor = fctGraph.functionalities[0]
        const tempSensorOutSlot = tempSensor.getOutSlots()[0]
        const errorMsg = 'no!'
        tempSensorOutSlot._connectTo = () => { throw new Error(errorMsg) }

        const { error, errorMsg: receivedErrorMsg } = (
          addPushOutFctForOutSlotWhichHasNone(fctGraph, tempSensorOutSlot)
        )

        expect(error).toBe(true)
        expect(receivedErrorMsg).toStrictEqual(errorMsg)
      })
    })
  })

  describe('given valid arguments', () => {
    it('adds a corresponding pushOut fct, which is connected to the outSlot', () => {
      const fctGraph = FCTGraphSeeder.seedOne({
        functionalities: [
          TemperatureSensorSeeder.generate(),
        ],
      })

      const tempSensor = fctGraph.functionalities[0]
      const tempSensorOutSlot = tempSensor.getOutSlots()[0]

      expect(fctGraph.functionalities).toHaveLength(1)

      addPushOutFctForOutSlotWhichHasNone(fctGraph, tempSensorOutSlot)

      expect(fctGraph.functionalities).toHaveLength(2)

      const [ temperatureSensor, pushOut ] = fctGraph.functionalities
      expect(temperatureSensor.isConnectedToFct(pushOut)).toBe(true)
    })

    it('sets the desired destination if one is provided', () => {
      const destination = { name: 'ospin-webapp' }
      const fctGraph = FCTGraphSeeder.seedOne({
        functionalities: [
          TemperatureSensorSeeder.generate(),
        ],
      })

      const tempSensor = fctGraph.functionalities[0]
      const tempSensorOutSlot = tempSensor.getOutSlots()[0]

      expect(fctGraph.functionalities).toHaveLength(1)

      addPushOutFctForOutSlotWhichHasNone(
        fctGraph,
        tempSensorOutSlot,
        { fctData: { destination } },
      )

      const intervalOutNodes = fctGraph.getPushOutFcts()

      expect(intervalOutNodes).toHaveLength(1)
      expect(intervalOutNodes[0].destination.name).toBe(destination.name)
    })

    it('sets the slot name correctly', () => {
      const destination = { name: 'ospin-webapp' }
      const fctGraph = FCTGraphSeeder.seedOne({
        functionalities: [
          TemperatureSensorSeeder.generate(),
        ],
      })

      const tempSensor = fctGraph.functionalities[0]
      const tempSensorOutSlot = tempSensor.getOutSlots()[0]

      expect(fctGraph.functionalities).toHaveLength(1)

      addPushOutFctForOutSlotWhichHasNone(
        fctGraph,
        tempSensorOutSlot,
        { fctData: { destination } },
      )

      const intervalOutNodes = fctGraph.getPushOutFcts()
      expect(intervalOutNodes[0].slots[0].name).toBe(PushOut.SLOT_NAME)
    })

    it('throws when "customData" is used', () => {
      const fctGraph = FCTGraphSeeder.seedOne({
        functionalities: [
          TemperatureSensorSeeder.generate(),
        ],
      })

      const tempSensor = fctGraph.functionalities[0]
      const tempSensorOutSlot = tempSensor.getOutSlots()[0]

      expect(() => {
        addPushOutFctForOutSlotWhichHasNone(
          fctGraph,
          tempSensorOutSlot,
          { customData: { name: 'Putin-Spy' } },
        )
      }).toThrow(/"customData" key is no longer supported/)
    })
  })

})
