const ObjUtils = require('utils/ObjUtils')
const RegexUtils = require('utils/RegexUtils')
const FCTGraphSeeder = require('seeders/fctGraph/FCTGraphSeeder')
const {
  TemperatureSensorSeeder,
  HeaterActuatorSeeder,
  PIDControllerSeeder,
  PushOutSeeder,
  PushInSeeder,
} = require('seeders/functionalities')
const FCTGraph = require('fctGraph/FCTGraph')
const DataStream = require('dataStreams/DataStream')
const connectedFCTGraphData = require('./seeds/connectedFCTGraphData')

describe('the FCTGraph class', () => {

  it('is JOIous', () => {
    expect(FCTGraph.isJOIous).toBe(true)
  })

  describe('#constructor', () => {
    it('throws if given an invalid data object', () => {
      expect(() => {
        new FCTGraph({}) // eslint-disable-line
      }).toThrow(/Cannot read property/)
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

  describe('#deepEquals', () => {
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
        TemperatureSensorSeeder.generateCelciusFloatProducer(),
        PIDControllerSeeder.generateTemperatureControllerCelcius(),
        HeaterActuatorSeeder.generateKelvinHeater(),
        PushOutSeeder.generateFloatPushOutCelcius(),
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
        TemperatureSensorSeeder.generateCelciusFloatProducer(),
        PushOutSeeder.generateFloatPushOutCelcius(),
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

})
