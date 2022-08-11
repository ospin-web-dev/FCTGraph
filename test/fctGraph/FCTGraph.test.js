const { v4: uuidv4 } = require('uuid')

const ObjUtils = require('utils/ObjUtils')
const RegexUtils = require('utils/RegexUtils')
const FCTGraphSeeder = require('seeders/fctGraph/FCTGraphSeeder')
const {
  TemperatureSensorSeeder,
  HeaterActuatorSeeder,
  PIDControllerSeeder,
  PushOutSeeder,
  IntervalOutSeeder,
  PushInSeeder,
} = require('seeders/functionalities')
const { FloatInSlotSeeder, FloatOutSlotSeeder } = require('seeders/slots')

const FCTGraph = require('fctGraph/FCTGraph')
const { TemperatureSensor } = require('functionalities')
const { FloatOutSlot } = require('slots')
const DataStream = require('dataStreams/DataStream')
const connectedFCTGraphData = require('./seeds/connectedFCTGraphData')
const connectedPIDFCTGraphData = require('./seeds/connectedPIDFctGraphData')

describe('the FCTGraph class', () => {

  it('is JOIous', () => {
    expect(FCTGraph.isJOIous).toBe(true)
  })

  describe('.assertValidDataAndNew', () => {
    it('assigns an id if none is provided', () => {
      const fctGraphData = FCTGraphSeeder.generate({ })
      delete fctGraphData.id

      const fctGraph = FCTGraph.assertValidDataAndNew(fctGraphData)
      expect(fctGraph.id).toMatch(RegexUtils.UUIDV4)
    })

    it('throws if given an invalid data object', () => {
      expect(() => {
        FCTGraph.assertValidDataAndNew({ id: uuidv4() }) // eslint-disable-line
      }).toThrow(/"deviceId" is required/)
    })

    it('creates an instance', () => {
      const fctGraphData = FCTGraphSeeder.generate({ })
      const fctGraph = new FCTGraph(fctGraphData)

      expect(fctGraph instanceof FCTGraph).toBe(true)
    })

    it('creates an instance when a slot is missing a datastream key', () => {
      const fctGraphData = FCTGraphSeeder.generate({ })
      delete fctGraphData.functionalities[0].slots[0].dataStreams

      const fctGraph = new FCTGraph(fctGraphData)

      expect(fctGraph instanceof FCTGraph).toBe(true)
    })

    it('assigns expected defaults when none are provided', () => {
      const fctGraphData = FCTGraphSeeder.generate({ })
      delete fctGraphData.functionalities
      delete fctGraphData.deviceDefault

      const fctGraph = new FCTGraph(fctGraphData)

      expect(fctGraph.functionalities).toStrictEqual([])
      expect(fctGraph.deviceDefault).toBe(false)
    })

    describe('when given an actual fctGraph that has been serialized', () => {
      it('creates the deeply nested dataStreams', () => {
        const fctGraph = new FCTGraph(connectedFCTGraphData)

        expect(fctGraph.dataStreamsCount).toBe(85)
      })
    })

    describe('when given a connected PID FctGraph', () => {
      it('should serialize the FCTGraph', () => {
        const fctGraph = new FCTGraph(connectedPIDFCTGraphData)
        expect(fctGraph instanceof FCTGraph).toBe(true)
      })

      it('should populate the datastreams', () => {
        const fctGraph = new FCTGraph(connectedPIDFCTGraphData)
        expect(fctGraph.dataStreamsCount).toBe(6)
      })
    })
  })

  describe('.newWithDataStreamsTopLevel', () => {
    it('does not throw if given an absent dataStreams value', () => {
      const fctGraphData = FCTGraphSeeder.generate()
      expect(() => {
        FCTGraph.newWithDataStreamsTopLevel(fctGraphData) // eslint-disable-line
      }).not.toThrow()
    })

    it('throws if given an invalid dataStreams value', () => {
      const fctGraphData = FCTGraphSeeder.generate()

      expect(() => {
        FCTGraph.newWithDataStreamsTopLevel({ dataStreams: 3, ...fctGraphData }) // eslint-disable-line
      }).toThrow(/"dataStreams" must be an array/)
    })

    it('creates a graph instance', () => {
      const fctGraphData = FCTGraphSeeder.generate({})
      fctGraphData.dataStreams = []

      const fctGraph = FCTGraph.newWithDataStreamsTopLevel(fctGraphData)

      // unfortunately instanceof not working here. due to this I believe
      // https://github.com/facebook/jest/issues/2549
      expect(fctGraph.constructor.name).toBe('FCTGraph')
    })

    it('the created functionalities are instances', () => {
      const sensor = TemperatureSensorSeeder.seedOne()
      const fctGraphData = FCTGraphSeeder
        .generate({ functionalities: [ sensor.serialize() ] })
      const fctGraph = new FCTGraph(fctGraphData)

      const { functionalities } = fctGraph

      expect(functionalities[0] instanceof TemperatureSensor).toBe(true)
    })

    it('the created slots are instances', () => {
      const sensor = TemperatureSensorSeeder.generateCelsiusFloatProducer()
      const fctGraphData = FCTGraphSeeder
        .generate({ functionalities: [ sensor ] })
      const fctGraph = new FCTGraph(fctGraphData)

      const { functionalities } = fctGraph
      const slot = functionalities[0].slots[0]

      expect(slot instanceof FloatOutSlot).toBe(true)
      expect(slot.dataType).toBeDefined()
      expect(slot.dataType).toBe(FloatOutSlot.DATA_TYPE)
      expect(slot.type).toBeDefined()
      expect(slot.type).toBe(FloatOutSlot.TYPE)
    })

    it('the created instance is joious', () => {
      const fctGraphData = FCTGraphSeeder.generate({})
      fctGraphData.dataStreams = []

      const fctGraph = FCTGraph.newWithDataStreamsTopLevel(fctGraphData)

      expect(fctGraph.constructor.isJOIous).toBe(true)
    })

    it('instantiates with the connections', () => {
      const unconnectedFctGraph = new FCTGraph(connectedFCTGraphData)
      unconnectedFctGraph.disconnectAll()

      expect(unconnectedFctGraph.dataStreamsCount).toBe(0)

      const dataStreams = FCTGraph.collectUniqueDataStreamsDataFromFctData(
        connectedFCTGraphData.functionalities,
      )

      expect(dataStreams.length).toBeGreaterThan(0)

      const fctGraphTraditional = new FCTGraph(connectedFCTGraphData)
      const fctGraphAltConstruction = FCTGraph.newWithDataStreamsTopLevel({
        ...unconnectedFctGraph.serialize(),
        dataStreams,
      })

      expect(
        FCTGraph.deepEquals(fctGraphTraditional, fctGraphAltConstruction),
      ).toBe(true)
    })

  })

  describe('.deepEquals', () => {
    describe('when the fctGraphs deep equal', () => {
      it('returns true', () => {
        const fctGraphData = FCTGraphSeeder.generate()
        const fctGraphA = new FCTGraph(fctGraphData)
        const fctGraphB = new FCTGraph(fctGraphData)

        const result = FCTGraph.deepEquals(fctGraphA, fctGraphB)
        expect(result).toBe(true)
      })
    })

    describe('when the fctGraphs do not equal', () => {
      it('returns false', () => {
        const fctGraphA = FCTGraphSeeder.seedOne()
        const fctGraphB = FCTGraphSeeder.seedOne()

        const result = FCTGraph.deepEquals(fctGraphA, fctGraphB)
        expect(result).toStrictEqual(false)
      })
    })
  })

  describe('.serialize', () => {
    it('serializes back to the original data object with a simple graph', () => {
      const fctGraphData = FCTGraphSeeder.generate()
      const fctGraph = new FCTGraph(fctGraphData)

      expect(fctGraph.serialize()).toStrictEqual(fctGraphData)
    })
  })

  describe('.toJSON', () => {
    it('returns the expected serialized JSON string', () => {
      const fctGraphData = FCTGraphSeeder.generate()
      const fctGraph = new FCTGraph(fctGraphData)
      const sortedJSONData = JSON.stringify(
        ObjUtils.sortByKeys(fctGraphData),
      )

      expect(JSON.stringify(fctGraph)).toStrictEqual(sortedJSONData)
    })
  })

  /* *******************************************************************
   * GRAPH ACTIONS
   * **************************************************************** */
  describe('.getConnectableFctsToTargetFct', () => {
    it('returns all FCTGraph fcts which can be connected to the given fct', () => {
      /* it is expected that the tempSensor (which has an outslot which
       * produces float values) can only connect to other functionalities
       * which have an un-occupied inslot that receives float values
       */
      const functionalities = [
        TemperatureSensorSeeder.generateCelsiusFloatProducer(),
        PIDControllerSeeder.generateTemperatureControllerCelsius(),
        HeaterActuatorSeeder.generateKelvinHeater(),
        PushOutSeeder.generateFloatPushOutCelsius(),
        PushInSeeder.generateIntegerPushIn(),
      ]

      const fctGraph = FCTGraphSeeder.seedOne({ functionalities })
      // eslint-disable-next-line
      const [ tempSensor, pidController, __, pushOut, ___ ] = fctGraph.functionalities

      const connectableFcts = fctGraph.getConnectableFctsToTargetFct(tempSensor)
      const connectableFctsIds = connectableFcts.map(({ id }) => id)

      expect(connectableFctsIds).toStrictEqual([ pidController.id, pushOut.id ])
      expect(connectableFcts).toStrictEqual([ pidController, pushOut ])
    })

    it('will provide fcts with slots that will connect', () => {
      const functionalities = [
        TemperatureSensorSeeder.generateCelsiusFloatProducer(),
        PushOutSeeder.generateFloatPushOutCelsius(),
      ]

      const fctGraph = FCTGraphSeeder.seedOne({ functionalities })

      const [ tempSensor, pushOut ] = fctGraph.functionalities
      const [ returnedFct ] = fctGraph.getConnectableFctsToTargetFct(tempSensor)

      expect(returnedFct).toStrictEqual(pushOut)
      expect(tempSensor.slots).toHaveLength(1)
      expect(pushOut.slots).toHaveLength(1)

      const tempOutSlot = tempSensor.slots[0]
      const pushOutSlot = pushOut.slots[0]

      const { dataStream } = tempOutSlot.connectTo(pushOutSlot)
      expect(dataStream instanceof DataStream).toBe(true)
    })
  })

  describe('.addFunctionalityByData', () => {
    it('returns a result.error === false when valid data is given', () => {
      const fctGraph = FCTGraphSeeder.seedOne()
      const pushOutData = PushOutSeeder.generate()
      delete pushOutData.id

      const { error } = fctGraph.addFunctionalityByData(pushOutData)

      expect(error).toBe(false)
    })

    it('returns result.error === true when invalid data is given, along with a result.errorMsg', () => {
      const fctGraph = FCTGraphSeeder.seedOne()
      const badId = 12345
      const pushOutData = PushOutSeeder.generate({ id: badId })

      const { error, errorMsg } = fctGraph.addFunctionalityByData(pushOutData)

      expect(error).toBe(true)
      expect(errorMsg).toContain('"id" must be a string')
    })

    it('returns the result.functionality with its newly assigned id as a UUIDv4', () => {
      const fctGraph = FCTGraphSeeder.seedOne()
      const pushOutData = PushOutSeeder.generate()
      delete pushOutData.id

      const { functionality } = fctGraph.addFunctionalityByData(pushOutData)

      expect(functionality.id).toMatch(RegexUtils.UUIDV4)
    })

    it('an unrelated fct does not get removed if the fct addition fails', () => {
      const fctGraph = FCTGraphSeeder.seedOne()
      const preLength = fctGraph.functionalities.length
      const pushOutData = PushOutSeeder.generate()
      delete pushOutData.name

      const { error } = fctGraph.addFunctionalityByData(pushOutData)

      expect(error).toBe(true)
      expect(fctGraph.functionalities).toHaveLength(preLength)
    })
  })

  describe('getFctsWithoutIONodes', () => {
    it('returns all fcts which are not an input or output node', () => {
      const inputFct = PushInSeeder.generate()
      const outputFct = PushOutSeeder.generate()
      const sensor = TemperatureSensorSeeder.generate()

      const fctGraph = FCTGraphSeeder
        .seedOne({ functionalities: [ inputFct, outputFct, sensor ] })

      const fcts = fctGraph.getFctsWithoutIONodes()

      expect(fcts).toHaveLength(1)
      expect(fcts[0].id).toBe(sensor.id)
    })
  })

  describe('getFctById', () => {
    it('returns a functionality by id', () => {
      const sensor = TemperatureSensorSeeder.seedOne()
      const fctGraph = FCTGraphSeeder
        .seedOne({ functionalities: [ sensor.serialize() ] })

      const res = fctGraph.getFctById(sensor.id)

      expect(res).toBeDefined()
      expect(res.id).toBe(sensor.id)
    })
  })

  describe('getFctsByName', () => {
    it('returns an array of all fcts that match the name', () => {
      const commonName = 'TempSensor'
      const sensor1 = TemperatureSensorSeeder.seedOne({ name: commonName })
      const sensor2 = TemperatureSensorSeeder.seedOne({ name: commonName })
      const sensor3 = TemperatureSensorSeeder.seedOne({ name: 'SpecialT' })
      const fctGraph = FCTGraphSeeder
        .seedOne({ functionalities: [
          sensor1.serialize(),
          sensor2.serialize(),
          sensor3.serialize(),
        ] })

      const fcts = fctGraph.getFctsByName(commonName)

      expect(fcts).toHaveLength(2)
      fcts.forEach(({ name }) => name === commonName)
    })
  })

  describe('getInputFcts', () => {
    it('returns the input fcts', () => {
      const inputFct = PushInSeeder.generate()
      const outputFct = PushOutSeeder.generate()
      const fctGraph = FCTGraphSeeder.seedOne({ functionalities: [ inputFct, outputFct ] })

      const fcts = fctGraph.getInputFcts()

      expect(fcts).toHaveLength(1)
      expect(fcts[0].id).toBe(inputFct.id)
    })
  })

  describe('getPushInFcts', () => {
    it('returns the PushIn input fcts', () => {
      const inputFct = PushInSeeder.generate()
      const outputFct = PushOutSeeder.generate()
      const fctGraph = FCTGraphSeeder.seedOne({ functionalities: [ inputFct, outputFct ] })

      const fcts = fctGraph.getPushInFcts()

      expect(fcts).toHaveLength(1)
      expect(fcts[0].id).toBe(inputFct.id)
    })
  })

  describe('getOutputFcts', () => {
    it('returns the output fcts', () => {
      const inputFct = PushInSeeder.generate()
      const outputFct = PushOutSeeder.generate()
      const fctGraph = FCTGraphSeeder.seedOne({ functionalities: [ inputFct, outputFct ] })

      const fcts = fctGraph.getOutputFcts()

      expect(fcts).toHaveLength(1)
      expect(fcts[0].id).toBe(outputFct.id)
    })
  })

  describe('getPushOutFcts', () => {
    it('returns the PushOut output fcts', () => {
      const inputFct = PushInSeeder.generate()
      const pushOutputFct = PushOutSeeder.generate()
      const intervalOutFct = IntervalOutSeeder.generate()
      const fctGraph = FCTGraphSeeder
        .seedOne({ functionalities: [ inputFct, pushOutputFct, intervalOutFct ] })

      const fcts = fctGraph.getPushOutFcts()

      expect(fcts).toHaveLength(1)
      expect(fcts[0].id).toBe(pushOutputFct.id)
    })
  })

  describe('getIONodeFcts', () => {
    it('should return the input and output nodes', () => {
      const inputFct = PushInSeeder.generate()
      const pushOutputFct = PushOutSeeder.generate()
      const sensor = TemperatureSensorSeeder.generate()
      const heater = HeaterActuatorSeeder.generate()

      const fctGraph = FCTGraphSeeder
        .seedOne({ functionalities: [ inputFct, pushOutputFct, heater,sensor ] })

      const fcts = fctGraph.getIONodeFcts()

      expect(fcts).toHaveLength(2)

    });
  });

  describe('getIntervalOutFcts', () => {
    it('returns the IntervalOut ushOut output fcts', () => {
      const inputFct = PushInSeeder.generate()
      const pushOutputFct = PushOutSeeder.generate()
      const intervalOutFct = IntervalOutSeeder.generate()
      const fctGraph = FCTGraphSeeder
        .seedOne({ functionalities: [ inputFct, pushOutputFct, intervalOutFct ] })

      const fcts = fctGraph.getIntervalOutFcts()

      expect(fcts).toHaveLength(1)
      expect(fcts[0].id).toBe(intervalOutFct.id)
    })
  })

  describe('clone', () => {
    const inputFct = PushInSeeder.generate()
    const pushOutputFct = PushOutSeeder.generate()
    const intervalOutFct = IntervalOutSeeder.generate()
    const fctGraph = FCTGraphSeeder
      .seedOne({ functionalities: [ inputFct, pushOutputFct, intervalOutFct ] })

    it('returns a carbon copy', () => {
      const fctGraphCopy = fctGraph.clone()

      expect(FCTGraph.deepEquals(fctGraphCopy, fctGraph)).toBe(true)

    })

    it('does not return the original', () => {
      const fctGraphCopy = fctGraph.clone()

      expect(fctGraphCopy).not.toBe(fctGraph)
    })
  })

  it('should set the fctGraph on the functionalities', () => {
    const sensor = TemperatureSensorSeeder.generate()
    const heater = HeaterActuatorSeeder.generate()

    const fctGraph = FCTGraphSeeder
      .seedOne({ functionalities: [ heater, sensor ] })

    const { functionalities } = fctGraph
    functionalities.forEach(({ fctGraph: fctGraphRef }) => {
      expect(fctGraphRef instanceof FCTGraph).toBe(true)
    })
  })

  describe('fctsDeepEqual', () => {
    const intervalOutFct = IntervalOutSeeder.generate()
    const sensor = TemperatureSensorSeeder.generate()
    const heater = HeaterActuatorSeeder.generate()

    const fctGraph = FCTGraphSeeder
      .seedOne({ functionalities: [ sensor, heater ] })

    describe('when functionalities are the same', () => {
      it('should return true', () => {
        expect(fctGraph.fctsDeepEquals(fctGraph)).toBe(true)
      })
    })

    describe('when functionalities are the same but in a different order', () => {
      it('should return true', () => {
        const fctGraph2 = FCTGraphSeeder
          .seedOne({ functionalities: [ heater, sensor ] })
        expect(fctGraph.fctsDeepEquals(fctGraph2)).toBe(true)
      })

      describe('when the slots are in a different order', () => {
        it('should return true', () => {
          const Slot1 = FloatInSlotSeeder.generateUnitlessIn({ name: 'D' })
          const Slot2 = FloatOutSlotSeeder.generateCelsiusOut({ name: 'value out' })
          const basefct = PIDControllerSeeder.generate()
          const fctData1 = { ...basefct, slots: [Slot1, Slot2 ] }
          const fctData2 = { ...basefct, slots: [Slot2, Slot1 ] }
          const fctGraphA = FCTGraphSeeder.seedOne({ functionalities: [fctData1] })
          const fctGraphB = FCTGraphSeeder.seedOne({ functionalities: [fctData2] })

          expect(fctGraphA.functionalities[0].slots[1].serialize())
            .toStrictEqual(fctGraphB.functionalities[0].slots[0].serialize())
          expect(fctGraphA.fctsDeepEquals(fctGraphB)).toBe(true)

          expect(fctGraphA.functionalities[0].slots[1].serialize())
            .toStrictEqual(fctGraphB.functionalities[0].slots[0].serialize())
        })
      })
    })

    describe('when the amount of functionalities is different', () => {
      it('should return false', () => {
        const fctGraph2 = FCTGraphSeeder
          .seedOne({ functionalities: [ heater, sensor, intervalOutFct ] })
        expect(fctGraph.fctsDeepEquals(fctGraph2)).toBe(false)

      })
    })

    describe('when the functionalities are different', () => {
      it('should return false', () => {
        const fctGraph2 = FCTGraphSeeder.seedOne({ functionalities: [
          TemperatureSensorSeeder.generate(),
          HeaterActuatorSeeder.generate(),
        ] })

        expect(fctGraph2.fctsDeepEquals(fctGraph)).toBe(false)
        expect(fctGraph.fctsDeepEquals(fctGraph2)).toBe(false)
      })
    })
  })

  describe('removeFCT', () => {
    it('should remove the fct including any connections', () => {
      const inputData = PushInSeeder.generate()
      const pushOutputData = PushOutSeeder.generateFloatPushOutCelsius()
      const intervalOutData = IntervalOutSeeder.generate()
      const tempSensorData = TemperatureSensorSeeder.generateCelsiusFloatProducer()

      const fctGraph = FCTGraphSeeder
        .seedOne(
          { functionalities: [ inputData, pushOutputData, intervalOutData, tempSensorData ] },
        )

      const pushOut = fctGraph.getFctById(pushOutputData.id)
      const tempSensor = fctGraph.getFctById(tempSensorData.id)

      const tempOutSlot = tempSensor.slots[0]
      const pushOutSlot = pushOut.slots[0]

      const { dataStream } = tempOutSlot.connectTo(pushOutSlot)
      expect(dataStream instanceof DataStream).toBe(true)

      expect(fctGraph.functionalities).toHaveLength(4)

      fctGraph.removeFct(pushOut)

      expect(fctGraph.functionalities).toHaveLength(3)

      expect(fctGraph.getFctById(pushOut.id)).toBeUndefined()
    })

    it('should throw an error if the fct can not be found', () => {
      const inputFct = PushInSeeder.generate()
      const pushOutputFct = PushOutSeeder.generate()
      const intervalOutFct = IntervalOutSeeder.generate()
      const nonFoundInputFct = PushInSeeder.seedOne()
      const fctGraph = FCTGraphSeeder
        .seedOne({ functionalities: [ inputFct, pushOutputFct, intervalOutFct ] })

      const { error, errorMsg } = fctGraph.removeFct(nonFoundInputFct)

      expect(error).toBe(true)
      expect(errorMsg).toBe('Fct can not be found on the graph')

    })

    it('should return the removed fct', () => {
      const inputFct = PushInSeeder.generate()
      const pushOutputFct = PushOutSeeder.generate()
      const intervalOutFct = IntervalOutSeeder.generate()
      const fctGraph = FCTGraphSeeder
        .seedOne({ functionalities: [ inputFct, pushOutputFct, intervalOutFct ] })
      const fctToBeRemoved = fctGraph.getFctById(pushOutputFct.id)

      const { removedFct } = fctGraph.removeFct(fctToBeRemoved)

      expect(removedFct).toBe(fctToBeRemoved)
    })
  })

  describe('getDisconnectedIONodeFcts', () => {
    it('should return all disconnected IONode fcts', () => {
      const inputData = PushInSeeder.generate()
      const pushOutputData = PushOutSeeder.generateFloatPushOutCelsius()
      const intervalOutData = IntervalOutSeeder.generate()
      const tempSensorData = TemperatureSensorSeeder.generateCelsiusFloatProducer()

      const fctGraph = FCTGraphSeeder
        .seedOne(
          { functionalities: [ inputData, pushOutputData, intervalOutData, tempSensorData ] },
        )

      const pushOut = fctGraph.getFctById(pushOutputData.id)
      const tempSensor = fctGraph.getFctById(tempSensorData.id)

      const tempOutSlot = tempSensor.slots[0]
      const pushOutSlot = pushOut.slots[0]

      tempOutSlot.connectTo(pushOutSlot)

      expect(fctGraph.getDisconnectedIONodeFcts()).toHaveLength(2)
    })
  })
})
