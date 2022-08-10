const {
  Functionality,
  Controller,
  Actuator,
  Sensor,
  InputNode,
  OutputNode,
  TemperatureSensor,
} = require('functionalities')
// this is exported separately from the index below we don't want to expose it publicly in the package
const FunctionalitySeeder = require('seeders/functionalities/FunctionalitySeeder')
const ControllerSeeder = require('seeders/functionalities/ControllerSeeder')
const ActuatorSeeder = require('seeders/functionalities/ActuatorSeeder')
const SensorSeeder = require('seeders/functionalities/SensorSeeder')
const InputNodeSeeder = require('seeders/functionalities/InputNodeSeeder')
const OutputNodeSeeder = require('seeders/functionalities/OutputNodeSeeder')
const {
  HeaterActuatorSeeder,
  PIDControllerSeeder,
  TemperatureSensorSeeder,
  PushOutSeeder,
} = require('seeders/functionalities')
const {
  FloatInSlotSeeder,
  FloatOutSlotSeeder,
  IntegerInSlotSeeder,
} = require('seeders/slots')

describe('the Functionality class', () => {

  describe('.constructor', () => {

    it('allows adding the outputIntervalMs property', () => {
      const functionalityData = TemperatureSensorSeeder.generate()
      functionalityData.outputIntervalMs = 1000

      const functionality = new Functionality(functionalityData)

      expect(functionality.outputIntervalMs).toBe(1000)
    })

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

  describe('protected instance properties throw when attempted to be set', () => {
    const PROTECTED_PROPERTY_NAMES = [ 'subType', 'type' ]

    PROTECTED_PROPERTY_NAMES.forEach(propName => {
      describe(`set .${propName}`, () => {
        it('throws error', () => {
          const fct = new Functionality(FunctionalitySeeder.generate())

          const newPropVal = 'jabroni'
          const expectedErrorString = new RegExp(
            `Can not set protected property on fct ${fct.name}: ${propName}`,
          )

          expect(() => {
            fct[propName] = newPropVal
          }).toThrow(expectedErrorString)
        })
      })
    })
  })

  describe('.subType', () => {
    it('is null for plain functionalities', () => {
      const fct = new Functionality(FunctionalitySeeder.generate())
      const controller = new Controller(ControllerSeeder.generate())
      const actuator = new Actuator(ActuatorSeeder.generate())
      const sensor = new Sensor(SensorSeeder.generate())
      const inputNode = new InputNode(InputNodeSeeder.generate())
      const outputNode = new OutputNode(OutputNodeSeeder.generate())

      expect(fct.subType).toBeNull()
      expect(controller.subType).toBeNull()
      expect(actuator.subType).toBeNull()
      expect(sensor.subType).toBeNull()
      expect(inputNode.subType).toBeNull()
      expect(outputNode.subType).toBeNull()
    })
  })

  describe('.isSubType', () => {
    it('returns true when the subType matches', () => {
      const heater = HeaterActuatorSeeder.seedOne()
      const pidController = PIDControllerSeeder.seedOne()
      const tempSensor = TemperatureSensorSeeder.seedOne()

      expect(heater.isSubType('HeaterActuator')).toBe(true)
      expect(heater.isSubType('PIDController')).toBe(false)
      expect(pidController.isSubType('PIDController')).toBe(true)
      expect(pidController.isSubType('TemperatureSensor')).toBe(false)
      expect(tempSensor.isSubType('TemperatureSensor')).toBe(true)
      expect(tempSensor.isSubType('HeaterActuator')).toBe(false)
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

        expect(pidController.dataStreamsCount).toBe(2)
      })
    })

    describe('.isConnected', () => {
      it('returns true for a connected fct', () => {
        const pidController = PIDControllerSeeder.seedOne(
          PIDControllerSeeder.generateTemperatureControllerCelsius(),
        )
        const tempSensor = TemperatureSensorSeeder.seedOne(
          TemperatureSensorSeeder.generateCelsiusFloatProducer(),
        )

        tempSensor.outSlots[0].connectTo(pidController.getSlotByName('value in'))

        expect(tempSensor.isConnected).toBe(true)
      })

      it('returns false for a disconnected fct', () => {
        const tempSensor = TemperatureSensorSeeder.seedOne(
          TemperatureSensorSeeder.generateCelsiusFloatProducer(),
        )

        expect(tempSensor.isConnected).toBe(false)
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

  describe('when calling .deriveUnit on a slot', () => {
    describe('on a slot that has NOT "any" as unit', () => {
      it('returns the unit of the slot', () => {
        const unit = '°C'
        const slotData = FloatInSlotSeeder.generate({ unit })
        const heater = HeaterActuatorSeeder.seedOne({ slots: [ slotData ] })

        const slotWithinFct = heater.getSlotByName(slotData.name)

        expect(slotWithinFct.derivedUnit).toBe(unit)
      })
    })

    describe('on a slot that has "any" as unit', () => {
      describe('when the slot is an InSlot', () => {
        describe('when it has no connection', () => {
          it('returns "any"', () => {
            const unit = 'any'
            const slotData = FloatInSlotSeeder.generate({ unit })
            const controller = PIDControllerSeeder.seedOne({ slots: [ slotData ] })

            const slotWithinFct = controller.getSlotByName(slotData.name)

            expect(slotWithinFct.derivedUnit).toBe(unit)
          })
        })

        describe('when it has a connection', () => {
          it('returns the derivedUnit of its source', () => {
            const unit = 'any'
            const sensorSlotUnit = '°C'
            const inSlotData = FloatInSlotSeeder.generate({ unit })
            const outSlotData = FloatOutSlotSeeder.generate({ unit: sensorSlotUnit })

            const controller = PIDControllerSeeder.seedOne({ slots: [ inSlotData ] })
            const sensor = TemperatureSensorSeeder.seedOne({ slots: [ outSlotData ] })

            const outSensorSlot = sensor.getSlotByName(outSlotData.name)
            const inControllerSlot = controller.getSlotByName(inSlotData.name)

            outSensorSlot.connectTo(inControllerSlot)

            expect(inControllerSlot.derivedUnit).toBe(outSensorSlot.derivedUnit)
          })
        })
      })

      describe('when the slot is an OutSlot', () => {
        it('returns "any"', () => {
          const unit = 'any'
          const slotData = FloatOutSlotSeeder.generate({ unit })
          const controller = PIDControllerSeeder.seedOne({ slots: [ slotData ] })

          const slotWithinFct = controller.getSlotByName(slotData.name)

          expect(slotWithinFct.derivedUnit).toBe(unit)
        })
      })
    })
  })

})
