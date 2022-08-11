const fctGraph = require('../index') // eslint-disable-line

describe('fctGraph module entry point)', () => {

  const MODULE_STRUCTURE = {
    FCTGraph: 'Class',
    FCTGraphSeeder: 'Class',
    FCTGraphUtils: {
      mutators: {
        addIntervalOutFctForOutSlotWhichHasNone: 'function',
        addIntervalOutFctForAllOutSlotsWhichHaveNone: 'function',
        addPushInFctForInSlotWhichHasNone: 'function',
        addPushInFctForAllInSlotsWhichHaveNone: 'function',
      },
      predicates: {
        fctGraphsAreSameWithoutIONodes: 'function',
        fctsAreFunctionallyEqual: 'function',
      },
    },

    functionalities: {
      FunctionalityFactory: 'Class',
      Functionality: 'Class',
      Sensor: 'Class',
      Actuator: 'Class',
      Controller: 'Class',
      InputNode: 'Class',
      OutputNode: 'Class',
      StirrerActuator: 'Class',
      PumpActuator: 'Class',
      TemperatureSensor: 'Class',
      UnknownSensor: 'Class',
      UnknownActuator: 'Class',
      HeaterActuator: 'Class',
      IntervalOut: 'Class',
      PIDController: 'Class',
      HysteresisController: 'Class',
      PushOut: 'Class',
      PushIn: 'Class',
      HeidolphOverheadStirrer: 'Class',
      HeidolphMagneticStirrer: 'Class',
      HeidolphPump: 'Class',
      HeidolphPumpByTorqueHysteresisController: 'Class',
      HeiConnect: 'Class',
      HeiFlowUltimate120: 'Class',
      HeiFlowUltimate600: 'Class',
      HeiTorqueUltimate100: 'Class',
      HeiTorqueUltimate200: 'Class',
      HeiTorqueUltimate400: 'Class',
      HamiltonPHArcSensor: 'Class',
      PHControllerHeidolphPumps: 'Class',
      KernRS232Scale: 'Class',
    },
    functionalitySeeders: {
      StirrerActuatorSeeder: 'Class',
      PumpActuatorSeeder: 'Class',
      TemperatureSensorSeeder: 'Class',
      UnknownSensorSeeder: 'Class',
      UnknownActuatorSeeder: 'Class',
      HeaterActuatorSeeder: 'Class',
      IntervalOutSeeder: 'Class',
      PIDControllerSeeder: 'Class',
      HysteresisControllerSeeder: 'Class',
      PushOutSeeder: 'Class',
      PushInSeeder: 'Class',
      HeidolphOverheadStirrerSeeder: 'Class',
      HeidolphMagneticStirrerSeeder: 'Class',
      HeidolphPumpSeeder: 'Class',
      HeidolphPumpByTorqueHysteresisControllerSeeder: 'Class',
      HeiConnectSeeder: 'Class',
      HeiFlowUltimate120Seeder: 'Class',
      HeiFlowUltimate600Seeder: 'Class',
      HeiTorqueUltimate100Seeder: 'Class',
      HeiTorqueUltimate200Seeder: 'Class',
      HeiTorqueUltimate400Seeder: 'Class',
      HamiltonPHArcSensorSeeder: 'Class',
      PHControllerHeidolphPumpsSeeder: 'Class',
      KernRS232ScaleSeeder: 'Class',
    },

    slots: {
      SlotFactory: 'Class',
      Slot: 'Class',
      InSlot: 'Class',
      OutSlot: 'Class',
      BooleanInSlot: 'Class',
      FloatInSlot: 'Class',
      IntegerInSlot: 'Class',
      OneOfInSlot: 'Class',
      AnyInSlot: 'Class',
      BooleanOutSlot: 'Class',
      FloatOutSlot: 'Class',
      IntegerOutSlot: 'Class',
      OneOfOutSlot: 'Class',
      AnyOutSlot: 'Class',
    },
    slotSeeders: {
      FloatInSlotSeeder: 'Class',
      IntegerInSlotSeeder: 'Class',
      OneOfInSlotSeeder: 'Class',
      BooleanInSlotSeeder: 'Class',
      AnyInSlotSeeder: 'Class',
      FloatOutSlotSeeder: 'Class',
      IntegerOutSlotSeeder: 'Class',
      OneOfOutSlotSeeder: 'Class',
      BooleanOutSlotSeeder: 'Class',
      AnyOutSlotSeeder: 'Class',
      RandomSlotSeeder: 'Class',
    },

    DataStream: 'Class',
  }

  function testFunctionPresentInModule(functionName, module) {
    it(`exposes function ${functionName}`, () => {
      expect(typeof module[functionName]).toBe('function')
    })
  }

  function isClassWithName(SupposedClass, className) {
    return (
      typeof SupposedClass === 'function'
      && SupposedClass.name === className
      && (
        /^\s*class[^\w]+/.test(SupposedClass.toString())
        || (globalThis[SupposedClass.name] === SupposedClass && /^[A-Z]/.test(SupposedClass.name)) // eslint-disable-line
      )
    )
  }

  function testClassPresentInModule(className, module) {
    it(`exposes class ${className}`, () => {
      const SupposedClass = module[className]

      expect(isClassWithName(SupposedClass, className)).toBe(true)
    })
  }

  function assertValueFunctionOrClassOrObject(value) {
    // this check provides some safety on the MODULE_STRUCTURE above so it is not extended
    // with something unexpected unintentionally
    if (value !== 'function' && value !== 'Class' && typeof value !== 'object') {
      throw new Error(`${value} must be string 'function' or 'Class' or an object`)
    }
  }

  function testExportAgainstModule(exportName, exportValue, path) {
    assertValueFunctionOrClassOrObject(exportValue)

    switch (exportValue) {
      case 'function':
        testFunctionPresentInModule(exportName, eval(path.join('.'))) // eslint-disable-line
        break
      case 'Class':
        testClassPresentInModule(exportName, eval(path.join('.'))) // eslint-disable-line
        break
      default:
        testModuleStructure(exportValue, [ ...path, exportName ]) // eslint-disable-line
        break
    }
  }

  function testModuleContainsExpectedNumberOfExports(expectedModule, actualModule) {
    const expectedNumberExports = Object.keys(expectedModule).length
    const numberExportsPresent = Object.keys(actualModule).length

    it(`exports ${expectedNumberExports} functions + modules`, () => {
      expect(numberExportsPresent).toBe(expectedNumberExports)
    })
  }

  function assertIsModule(actualModule, path) {
    if (typeof actualModule !== 'object') {
      throw new Error(`FCTGraph module at: ${path.join('.')} is not an object`)
    }
  }

  function testModuleStructure(expectedModule, path) {
    describe(`${path.join('.')}`, () => {
      const fctGraphModule = eval(path.join('.')) // eslint-disable-line
      assertIsModule(fctGraphModule, path)
      testModuleContainsExpectedNumberOfExports(expectedModule, fctGraphModule)

      Object.entries(expectedModule).forEach(([ exportName, exportValue ]) => {
        testExportAgainstModule(exportName, exportValue, path)
      })
    })
  }

  testModuleStructure(MODULE_STRUCTURE, [ 'fctGraph' ])

})
