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
const FCTGraph = require('fctGraph/FCTGraph')
const DataStream = require('dataStreams/DataStream')
const connectedFCTGraphData = require('./seeds/connectedFCTGraphData')

describe('the FCTGraph class', () => {

  it('is JOIous', () => {
    expect(FCTGraph.isJOIous).toBe(true)
  })

  describe('.newAndAssertStructure', () => {
    it('throws if given an invalid data object', () => {
      expect(() => {
        FCTGraph.newAndAssertStructure({}) // eslint-disable-line
      }).toThrow(/"id" is required/)
    })

    it('creates an instance', () => {
      const fctGraphData = FCTGraphSeeder.generate({ })
      const fctGraph = new FCTGraph(fctGraphData)

      expect(fctGraph instanceof FCTGraph).toBe(true)
    })

    describe('when given an actual fctGraph that has been serialized', () => {
      it('creates the deeply nested dataStreams', () => {
        const fctGraph = new FCTGraph(connectedFCTGraphData)

        expect(fctGraph.dataStreamsCount).toBe(85)
      })
    })
  })

  describe('.newWithDataStreamsTopLevel', () => {
    it('throws if given an invalid or absent dataStreams value', () => {
      const fctGraphData = FCTGraphSeeder.generate()
      expect(() => {
        FCTGraph.newWithDataStreamsTopLevel(fctGraphData) // eslint-disable-line
      }).toThrow(/"dataStreams" must be present and an array/)

      expect(() => {
        FCTGraph.newWithDataStreamsTopLevel({ dataStreams: 3, ...fctGraphData }) // eslint-disable-line
      }).toThrow(/"dataStreams" must be present and an array/)
    })

    it('creates an instance', () => {
      const fctGraphData = FCTGraphSeeder.generate({})
      fctGraphData.dataStreams = []

      const fctGraph = FCTGraph.newWithDataStreamsTopLevel(fctGraphData)

      // unfortunately instanceof not working here. due to this I believe
      // https://github.com/facebook/jest/issues/2549
      expect(fctGraph.constructor.name).toStrictEqual('FCTGraph')
    })

    it('instantiates with the connections', () => {
      const unconnectedFctGraph = new FCTGraph(connectedFCTGraphData)
      unconnectedFctGraph.disconnectAll()

      expect(unconnectedFctGraph.dataStreamsCount).toBe(0)

      const dataStreams = FCTGraph._collectUniqueDataStreamsData(
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
    it('serializes back to the original data object', () => {
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
      const fctGraph = FCTGraphSeeder.seedOne()
      const fct = fctGraph.functionalities[0]

      const res = fctGraph.getFctById(fct.id)

      expect(res).toStrictEqual(fct)
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
    })

    describe('when the amount of functionalities is different', () => {
      it('should return false', () => {
        const fctGraph2 = FCTGraphSeeder
          .seedOne({ functionalities: [ heater, sensor, intervalOutFct ] })
        expect(fctGraph.fctsDeepEquals(fctGraph2)).toBe(false)

      });
    });

    describe('when the functionalities are different', () => {
      it('should return false', () => {
        const fctGraph2 = FCTGraphSeeder.seedOne({ functionalities:[
          TemperatureSensorSeeder.generate(),
          HeaterActuatorSeeder.generate(),
        ]})

        expect(fctGraph2.fctsDeepEquals(fctGraph)).toBe(false)
        expect(fctGraph.fctsDeepEquals(fctGraph2)).toBe(false)

      })

    });

  });

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

    it('should throw an error when', () => {
      const inputFct = PushInSeeder.generate()
      const pushOutputFct = PushOutSeeder.generate()
      const intervalOutFct = IntervalOutSeeder.generate()
      const fctGraph = FCTGraphSeeder
        .seedOne({ functionalities: [ inputFct, pushOutputFct, intervalOutFct ] })
      const fctToBeRemoved = fctGraph.getFctById(pushOutputFct.id)

      jest.spyOn(fctToBeRemoved, '_getConnectedFcts').mockImplementation(() => [1,2])

      const { error, errorMsg } = fctGraph.removeFct(fctToBeRemoved)

      expect(error).toBe(true)
      expect(errorMsg).toMatch(/Fct is still connected/)
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

})
