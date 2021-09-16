const { Functionality } = require('functionalities')
const {
  HeaterActuatorSeeder,
  PIDControllerSeeder,
  TemperatureSensorSeeder,
  PushOutSeeder,
} = require('seeders/functionalities')
const {
  FloatInSlotSeeder,
  IntegerInSlotSeeder,
} = require('seeders/slots')

describe('the Functionality class', () => {

  describe('.constructor', () => {
    describe('re: assigning default values', () => {
      it('assigns `isVirtual` to false', () => {
        const functionalityData = TemperatureSensorSeeder.generate()
        delete functionalityData.isVirtual

        const functionality = new Functionality(functionalityData)

        expect(functionality.isVirtual).toBe(false)
      })
    })

    describe('when creating its slots', () => {
      it('will throw error if given slots data containing duplicate data', () => {
        const DUPLICATE_NAME = 'jabrone'
        const UNIQUE_NAME = 'frank reynolds'
        const slotA = FloatInSlotSeeder.generate({ name: DUPLICATE_NAME })
        const slotB = IntegerInSlotSeeder.generate({ name: UNIQUE_NAME })
        const slotC = IntegerInSlotSeeder.generate({ name: DUPLICATE_NAME })

        const fctData = TemperatureSensorSeeder.generate({ slots: [ slotA, slotB, slotC ] })

        expect(() => new Functionality(fctData)).toThrow(
          /already has a slot with the same name/,
        )
      })
    })
  })

  describe('.isPhysical', () => {
    it('returns the inverse of .isVirtual', () => {
      const virtualSensor = TemperatureSensorSeeder.seedOne({ isVirtual: true })
      expect(virtualSensor.isVirtual).toBe(true)

      const physicalSensor = TemperatureSensorSeeder.seedOne({ isVirtual: false })
      expect(physicalSensor.isVirtual).toBe(false)

      expect(virtualSensor.isPhysical).toBe(!virtualSensor.isVirtual)
      expect(physicalSensor.isPhysical).toBe(!physicalSensor.isVirtual)
    })
  })

  describe('getting connected fcts', () => {
    describe('.connectedFcts', () => {
      it('returns all connected fcts', () => {
        const heater = HeaterActuatorSeeder.seedOne(
          HeaterActuatorSeeder.generateCelsiusHeater(),
        )
        const pidController = PIDControllerSeeder.seedOne(
          PIDControllerSeeder.generateTemperatureControllerCelsius(),
        )
        const tempSensor = TemperatureSensorSeeder.seedOne(
          TemperatureSensorSeeder.generateCelsiusFloatProducer(),
        )

        expect(tempSensor.connectedFcts).toHaveLength(0)
        expect(heater.connectedFcts).toHaveLength(0)
        expect(pidController.connectedFcts).toHaveLength(0)

        tempSensor.outSlots[0].connectTo(pidController.getSlotByName('value in'))

        expect(heater.connectedFcts).toHaveLength(0)
        expect(tempSensor.connectedFcts).toHaveLength(1)
        expect(pidController.connectedFcts).toHaveLength(1)
        expect(tempSensor.connectedFcts[0]).toBe(pidController)
        expect(pidController.connectedFcts[0]).toBe(tempSensor)

        pidController.outSlots[0].connectTo(heater.inSlots[0])

        expect(heater.connectedFcts).toHaveLength(1)
        expect(tempSensor.connectedFcts).toHaveLength(1)
        expect(pidController.connectedFcts).toHaveLength(2)
        expect(heater.connectedFcts[0]).toBe(pidController)
        expect(pidController.connectedFcts).toStrictEqual([
          tempSensor, heater,
        ])
      })
    })

    describe('.sources', () => {
      it('all fcts connected via inslots', () => {
        const heater = HeaterActuatorSeeder.seedOne(
          HeaterActuatorSeeder.generateCelsiusHeater(),
        )
        const pidController = PIDControllerSeeder.seedOne(
          PIDControllerSeeder.generateTemperatureControllerCelsius(),
        )
        const tempSensor = TemperatureSensorSeeder.seedOne(
          TemperatureSensorSeeder.generateCelsiusFloatProducer(),
        )

        tempSensor.outSlots[0].connectTo(pidController.getSlotByName('value in'))
        pidController.outSlots[0].connectTo(heater.inSlots[0])

        expect(pidController.sources).toStrictEqual([ tempSensor ])
        expect(heater.sources).toStrictEqual([ pidController ])
      })
    })

    describe('.connectedPushOutNodes', () => {
      it('returns all fcts connected which are of type OutputNode', () => {
        const heaterA = HeaterActuatorSeeder.seedOne(
          HeaterActuatorSeeder.generateCelsiusHeater(),
        )
        const reporterA = PushOutSeeder.seedOne(
          PushOutSeeder.generateFloatPushOutCelsius(),
        )
        const reporterB = PushOutSeeder.seedOne(
          PushOutSeeder.generateFloatPushOutCelsius(),
        )
        const pidController = PIDControllerSeeder.seedOne(
          PIDControllerSeeder.generateTemperatureControllerCelsius(),
        )
        pidController.outSlots[0].connectTo(heaterA.inSlots[0])
        pidController.outSlots[0].connectTo(reporterA.inSlots[0])
        pidController.outSlots[0].connectTo(reporterB.inSlots[0])

        expect(heaterA.connectedPushOutNodes).toStrictEqual([])
        expect(pidController.connectedPushOutNodes).toStrictEqual([
          reporterA, reporterB,
        ])
      })
    })

    describe('.sinks', () => {
      it('returns all fcts connected via outslots', () => {
        const heaterA = HeaterActuatorSeeder.seedOne(
          HeaterActuatorSeeder.generateCelsiusHeater(),
        )
        const heaterB = HeaterActuatorSeeder.seedOne(
          HeaterActuatorSeeder.generateCelsiusHeater(),
        )
        const pidController = PIDControllerSeeder.seedOne(
          PIDControllerSeeder.generateTemperatureControllerCelsius(),
        )
        const tempSensor = TemperatureSensorSeeder.seedOne(
          TemperatureSensorSeeder.generateCelsiusFloatProducer(),
        )

        tempSensor.outSlots[0].connectTo(pidController.getSlotByName('value in'))
        pidController.outSlots[0].connectTo(heaterA.inSlots[0])
        pidController.outSlots[0].connectTo(heaterB.inSlots[0])

        expect(tempSensor.sinks).toStrictEqual([ pidController ])
        expect(heaterA.sinks).toStrictEqual([])
        expect(pidController.sinks).toStrictEqual([
          heaterA, heaterB,
        ])
      })
    })

    describe('getConnectedFctsByName', () => {
      it('returns all fcts connected that match the specific name', () => {
        const CONTROLLER_NAME = 'pid controller'
        const REPORTER_NAME = 'web reporter'

        const tempSensorA = TemperatureSensorSeeder.seedOne(
          TemperatureSensorSeeder.generateCelsiusFloatProducer(),
        )
        const tempSensorB = TemperatureSensorSeeder.seedOne(
          TemperatureSensorSeeder.generateCelsiusFloatProducer(),
        )
        const pidControllerA1 = PIDControllerSeeder.seedOne(
          PIDControllerSeeder.generateTemperatureControllerCelsius({ name: CONTROLLER_NAME }),
        )
        const pidControllerA2 = PIDControllerSeeder.seedOne(
          PIDControllerSeeder.generateTemperatureControllerCelsius({ name: CONTROLLER_NAME }),
        )
        const pidControllerB1 = PIDControllerSeeder.seedOne(
          PIDControllerSeeder.generateTemperatureControllerCelsius({ name: CONTROLLER_NAME }),
        )
        const webReporterA1 = PushOutSeeder.seedOne(
          PushOutSeeder.generateFloatPushOutCelsius({ name: REPORTER_NAME }),
        )
        const webReporterA2 = PushOutSeeder.seedOne(
          PushOutSeeder.generateFloatPushOutCelsius({ name: REPORTER_NAME }),
        )

        tempSensorA.outSlots[0].connectTo(pidControllerA1.getSlotByName('value in'))
        tempSensorA.outSlots[0].connectTo(pidControllerA2.getSlotByName('value in'))
        tempSensorA.outSlots[0].connectTo(webReporterA1.getSlotByName('value in'))
        tempSensorA.outSlots[0].connectTo(webReporterA2.getSlotByName('value in'))

        tempSensorB.outSlots[0].connectTo(pidControllerB1.getSlotByName('value in'))

        expect(tempSensorA.getConnectedFctsByName(CONTROLLER_NAME)).toStrictEqual([
          pidControllerA1,
          pidControllerA2,
        ])

        expect(tempSensorA.getConnectedFctsByName(REPORTER_NAME)).toStrictEqual([
          webReporterA1,
          webReporterA2,
        ])

        expect(tempSensorB.getConnectedFctsByName(CONTROLLER_NAME)).toStrictEqual([
          pidControllerB1,
        ])
      })
    })

  })

})
