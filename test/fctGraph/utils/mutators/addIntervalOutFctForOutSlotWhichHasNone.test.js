const FCTGraphSeeder = require('seeders/fctGraph/FCTGraphSeeder')
const { TemperatureSensorSeeder, IntervalOutSeeder } = require('seeders/functionalities')
const IntervalOut = require('functionalities/IntervalOut')
const { IntegerInSlotSeeder, IntegerOutSlotSeeder } = require('seeders/slots')

const addIntervalOutFctForOutSlotWhichHasNone = require('fctGraph/Utils/mutators/addIntervalOutFctForOutSlotWhichHasNone')

describe('addIntervalOutFctForOutSlotWhichHasNone', () => {

  describe('given invalid arguments', () => {
    it('throws error if the first argument is not a fctGraph instance', () => {
      const fctGraphData = FCTGraphSeeder.generate()
      const outSlot = IntegerOutSlotSeeder.seedOne()

      expect(
        () => addIntervalOutFctForOutSlotWhichHasNone(fctGraphData, outSlot),
      ).toThrow(/the first argument must be an instance of fctGraph/)
    })

    it('throws error if the slot\'s parent fct can not be found on the fctGraph', () => {
      const fctGraph = FCTGraphSeeder.seedOne()
      const outSlot = IntegerOutSlotSeeder.seedOne()

      expect(
        () => addIntervalOutFctForOutSlotWhichHasNone(fctGraph, outSlot),
      ).toThrow(/parent fct can not be found/)
    })

    it('throws error if the slot is not an outslot', () => {
      const fctGraph = FCTGraphSeeder.seedOne()
      const inSlot = IntegerInSlotSeeder.seedOne()

      expect(
        () => addIntervalOutFctForOutSlotWhichHasNone(fctGraph, inSlot),
      ).toThrow(/must be of type OutSlot/)
    })

    it('throws error if the slot already has a connected OutputNode fct', () => {
      const fctGraph = FCTGraphSeeder.seedOne({
        functionalities: [
          TemperatureSensorSeeder.generateCelsiusFloatProducer(),
          IntervalOutSeeder.generateFloatIntervalOutCelsius(),
        ],
      })

      const [ temperatureSensor, intervalOutFct ] = fctGraph.functionalities
      const { error } = temperatureSensor.outSlots[0].connectTo(intervalOutFct.inSlots[0])

      expect(
        () => addIntervalOutFctForOutSlotWhichHasNone(fctGraph, temperatureSensor.outSlots[0]),
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

        expect(() => addIntervalOutFctForOutSlotWhichHasNone(fctGraph, tempSensorOutSlot))
          .toThrow(errorMsg)
      })
    })
  })

  describe('given valid arguments', () => {
    it('adds a corresponding intervalOut fct, which is connected to the outSlot', () => {
      const fctGraph = FCTGraphSeeder.seedOne({
        functionalities: [
          TemperatureSensorSeeder.generate(),
        ],
      })

      const tempSensor = fctGraph.functionalities[0]
      const tempSensorOutSlot = tempSensor.getOutSlots()[0]

      expect(fctGraph.functionalities).toHaveLength(1)

      addIntervalOutFctForOutSlotWhichHasNone(fctGraph, tempSensorOutSlot)

      expect(fctGraph.functionalities).toHaveLength(2)

      const [ temperatureSensor, intervalOut ] = fctGraph.functionalities
      expect(temperatureSensor.isConnectedToFct(intervalOut)).toBe(true)
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

      addIntervalOutFctForOutSlotWhichHasNone(
        fctGraph,
        tempSensorOutSlot,
        { fctData: { destination } },
      )

      const intervalOutNodes = fctGraph.getIntervalOutFcts()

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

      addIntervalOutFctForOutSlotWhichHasNone(
        fctGraph,
        tempSensorOutSlot,
        { fctData: { destination } },
      )

      const intervalOutNodes = fctGraph.getIntervalOutFcts()
      expect(intervalOutNodes[0].slots[0].name).toBe(IntervalOut.SLOT_NAME)
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
        addIntervalOutFctForOutSlotWhichHasNone(
          fctGraph,
          tempSensorOutSlot,
          { customData: { name: 'Putin-Spy' } },
        )
      }).toThrow(/"customData" key is no longer supported/)
    })
  })
})
