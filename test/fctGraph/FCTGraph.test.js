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

describe('the FCTGraph class', () => {

  it('is JOIous', () => {
    expect(FCTGraph.isJOIous).toBe(true)
  })

  describe('#constructor', () => {
    it('throws if given an invalid data object', () => {
      expect(() => {
        new FCTGraph({}) // eslint-disable-line
      }).toThrow('is required')
    })

    it('creates an instance', () => {
      const deviceDefault = true
      const fctGraphData = FCTGraphSeeder.generate({ deviceDefault })
      const fctGraph = new FCTGraph(fctGraphData)

      expect(fctGraph instanceof FCTGraph).toBe(true)
      expect(fctGraph.deviceDefault).toBe(true)
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
      const functionalities = [
        TemperatureSensorSeeder.generateCelciusProducer(),
        PIDControllerSeeder.generateTemperatureControllerCelcius(),
        HeaterActuatorSeeder.generateKelvinHeater(),
        PushOutSeeder.generate(),
        PushInSeeder.generate(),
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
        TemperatureSensorSeeder.generateCelciusProducer(),
        PushOutSeeder.generate(),
      ]

      const fctGraph = FCTGraphSeeder.seedOne({ functionalities })

      const [ tempSensor, pushOut ] = fctGraph.functionalities
      const [ returnedFct ] = fctGraph.getConnectableFctsToTargetFct(tempSensor)

      expect(returnedFct).toStrictEqual(pushOut)
      expect(tempSensor.slots).toHaveLength(1)
      expect(pushOut.slots).toHaveLength(1)

      const tempOutSlot = tempSensor.slots[0]
      const pushOutSlot = pushOut.slots[0]

      const { dataStream } = tempOutSlot.addConnectionTo(pushOutSlot)
      expect(dataStream instanceof DataStream).toBe(true)
    })
  })

  describe('.addFunctionality', () => {
    it('returns a result.error === false when valid data is given', () => {
      const fctGraph = FCTGraphSeeder.seedOne()
      const pushOutData = PushOutSeeder.generate()
      delete pushOutData.id

      const { error } = fctGraph.addFunctionality(pushOutData)

      expect(error).toBe(false)
    })

    it('returns result.error === true when invalid data is given, along with an result.errorMsg', () => {
      const fctGraph = FCTGraphSeeder.seedOne()
      const badId = 12345
      const pushOutData = PushOutSeeder.generate({ id: badId })

      const { error, errorMsg } = fctGraph.addFunctionality(pushOutData)

      expect(error).toBe(true)
      expect(errorMsg).toContain('"id" must be a string')
    })

    it('returns the result.functionality with its newly assigned id as a UUIDv4', () => {
      const fctGraph = FCTGraphSeeder.seedOne()
      const pushOutData = PushOutSeeder.generate()
      delete pushOutData.id

      const { functionality } = fctGraph.addFunctionality(pushOutData)

      expect(functionality.id).toMatch(RegexUtils.UUIDV4)
    })

    it('the fct gets removed if the fct graph\'s structure fails validation after the fct is added', () => {
      const fctGraph = FCTGraphSeeder.seedOne()
      const preLength = fctGraph.functionalities.length
      const pushOutData = PushOutSeeder.generate()
      delete pushOutData.id

      const pushSpy = jest.spyOn(fctGraph.functionalities, 'push').mockImplementation(el => {
        fctGraph.functionalities = [ ...fctGraph.functionalities, el ]
        fctGraph.id = 'really bad id'
      })
      fctGraph.addFunctionality(pushOutData)

      pushSpy.mockRestore()
      expect(fctGraph.functionalities).toHaveLength(preLength)
    })
  })

})
