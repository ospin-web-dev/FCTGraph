const OutputNode = require('functionalities/OutputNode')
const OutputNodeSeeder = require('seeders/functionalities/OutputNodeSeeder')
const {
  TemperatureSensorSeeder,
  PushOutSeeder,
} = require('seeders/functionalities')
const {
  FloatOutSlotSeeder,
  FloatInSlotSeeder,
} = require('seeders/slots')

describe('the OutputNode virtual class', () => {

  describe('.constructor', () => {
    describe('re: assigning default values', () => {
      it('assigns `destination` to the class default if none is provided', () => {
        const outputNodeData = OutputNodeSeeder.generate()
        delete outputNodeData.destination

        const outputNode = new OutputNode(outputNodeData)

        expect(outputNode.destination).toStrictEqual(
          OutputNode.DEFAULT_DESTINATION,
        )
      })
    })
  })

  describe('.serialize', () => {
    it('serializes with the destination included', () => {
      const destination = { name: 'bauer sucht frau' }
      const outputNodeData = OutputNodeSeeder.generate({ destination })

      const outputNode = new OutputNode(outputNodeData)

      expect(outputNode.serialize().destination).toStrictEqual(destination)
    })
  })

  describe('get .isOutputNode', () => {
    it('returns true if the fct is indeed an OutputNode', () => {
      const outputNodeData = OutputNodeSeeder.generate()
      const outputNode = new OutputNode(outputNodeData)

      expect(outputNode.isOutputNode).toBe(true)
    })
  })

  describe('get .source', () => {
    it('returns true if the fct is indeed an OutputNode', () => {
      const webReporter = PushOutSeeder.seedOne(
        PushOutSeeder.generateFloatPushOutCelsius(),
      )
      const tempSensor = TemperatureSensorSeeder.seedOne(
        TemperatureSensorSeeder.generateCelsiusFloatProducer(),
      )

      webReporter.inSlots[0].connectTo(tempSensor.slots[0])

      expect(webReporter.source).toBe(tempSensor)
    })

    it('returns undefined if none is found', () => {
      const webReporter = PushOutSeeder.seedOne(
        PushOutSeeder.generateFloatPushOutCelsius(),
      )

      expect(webReporter.source).toBeUndefined()
    })

    it('errors if somehow the outputnode has two sources', () => {
      const webReporter = PushOutSeeder.seedOne(
        PushOutSeeder.generateFloatPushOutCelsius(),
      )
      const tempSensorA = TemperatureSensorSeeder.seedOne(
        TemperatureSensorSeeder.generateCelsiusFloatProducer(),
      )
      const tempSensorB = TemperatureSensorSeeder.seedOne(
        TemperatureSensorSeeder.generateCelsiusFloatProducer(),
      )

      webReporter.inSlots[0].connectTo(tempSensorA.slots[0])
      /* this jank below is to circumvent safety checks.
       * apparently it is not easy to connect something
       * that should not be connected */
      const dataStream = webReporter.inSlots[0]._createDataStreamTo(tempSensorB.slots[0], {})
      webReporter.inSlots[0]._connectTo(tempSensorB.slots[0], dataStream)

      expect(() => webReporter.source).toThrow(/more than one connected fct/)
    })
  })

  describe('getSourceFct', () => {
    it('returns the sole source functionality', () => {
      const inSlotData = FloatInSlotSeeder.generateCelsiusIn()
      const outSlotData = FloatOutSlotSeeder.generateCelsiusOut()
      const sensorFct = TemperatureSensorSeeder.seedOne({ slots: [ outSlotData ] })
      const pushOutFct = PushOutSeeder.seedOne({ slots: [ inSlotData ] })

      pushOutFct.inSlots[0].connectTo(sensorFct.outSlots[0])

      const sourceFct = pushOutFct.getSourceFct()

      expect(sourceFct).toStrictEqual(sensorFct)
    })
  })

  describe('getConnectingSourceSlot', () => {
    it('returns the connecting slot of the source fct', () => {
      const inSlotData = FloatInSlotSeeder.generateCelsiusIn()
      const outSlotData = FloatOutSlotSeeder.generateCelsiusOut()
      const sensorFct = TemperatureSensorSeeder.seedOne({ slots: [ outSlotData ] })
      const pushOutFct = PushOutSeeder.seedOne({ slots: [ inSlotData ] })

      pushOutFct.inSlots[0].connectTo(sensorFct.outSlots[0])

      const sourceSlot = pushOutFct.getConnectingSourceSlot()

      expect(sourceSlot).toStrictEqual(sensorFct.outSlots[0])
    })
  })
})
