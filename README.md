[![codecov](https://codecov.io/gh/ospin-web-dev/FCTGraph/branch/master/graph/badge.svg)](https://codecov.io/gh/ospin-web-dev/FCTGraph)
[![Maintainability](https://api.codeclimate.com/v1/badges/ab083cc74a1fbb1d7319/maintainability)](https://codeclimate.com/repos/60ae147b04beeb018b015a77/maintainability)

This documentation is likely to remain sparse, as it is for internal use and under development!

---

## Table of Contents

- [Use Overview](#UseOverview)
  - [Instantiation](#Instantiation)
  - [Action](#Action)
  - [Inspection](#Inspection)
  - [From/To JSON](#FromAndToJson)
- [Class Structure and Hierarchies](#ClassStructureAndHierarchies)
- [Factories](#Factories)
- [Seeders](#Seeders)
- [Contributing](#Contributing)
- [Upcoming](#Upcoming)

---

## <a name="UseOverview"></a>Use Overview

The FCTGraph functions like a traditional graph with several features on top. Most importantly, all functionalities (nodes) have many slots, which hold data about themselves. Slots connect to other slots (if they are compatible) via dataStreams (edges).

The following is a selected showcase of the public functions on the various base objects of:
- **FCTGraph** (graph)
- **Functionality** (node)
- **Slot** (connection rule object)
- **DataStream** (edge)

#### <a name="Instantiation">Instantiation!
```js
const { FCTGraph, functionalities, slots } = require('@ospin/FCTGraph') // or import

// first, let's set up some seed data. Functionalities (nodes) have many dataStreams (edges)...
const tempOutSlotData = { name: 'temp out', type: 'OutSlot', ... } /* see OutSlot.SCHEMA */
const tempSensorData = { slots: [ tempOutSlotData ], ... } /* see TemperatureSensor.SCHEMA */

const tempInSlotData = { name: 'temp in', type: 'InSlot', ... } /* see InSlot.SCHEMA */
const pidControllerData = { slots: [ tempInSlotData ], ... }  /* see PIDController.SCHEMA */

// ...and instantiate our FCTGraph
const fctGraph = new FCTGraph({
  functionalities: [ tempSensorData, pidControllerData ],
  ...,
}) /* see FCTGraph.SCHEMA */)

// we can also add functionalities after the fact
fctGraph.addFunctionality({ ...heaterActuatorData })

fctGraph.functionalities
// -> a temperature sensor with a temperature outslot
// -> a PID controller with a temperature in slot
// -> a heater actuator
```

#### <a name="Action">Action!
```js
// ...continuing from above. let's connect the temperature sensor to the PIDController
const [ tempSensor, pidController, heaterActuator ] = fctGraph.functionalities

const { slots: [ tempOutSlot, ... ] } = tempSensor
const { slots: pidControllerSlots } = pidController

// get those slots on the PIDController which are connectable to the temperature sensor
const [ connectableSlot, ... ] = tempOutSlot.filterConnectableSlots(pidControllerSlots)

// connect!
const { dataStream } = tempOutSlot.addConnectionTo(connectableSlot)
// -> dataStream { id, sourceSlotName: 'temp out', sinkSlotName: 'temp in', ... }
```

#### <a name="Inspection">Inspection!
```js
// ...continuing from above
tempSensor.isPossibleToConnectToFct(pidController)
// -> true

fctGraph.getConnectableFctsToTargetFct(pidController)
// -> [ tempSensor, ... ]


// Graph mutating public methods return a standard response object:
// response object: { error: <bool>, errorMsg: <string>, ...relevantData }

const goodFctData = /* valid data for a new functionality */
const { error, errorMsg, functionality } = fctGraph.addFunctionality(fctData)

console.log(error) // -> false
console.log(errorMsg) // -> null
console.log(functionality instanceof Functionality) // -> null
```

#### <a name="FromAndToJson">From JSON, all life flows, and returns
```js
fctGraph.serialize()
// -> returns the nested data object (no instances)

const fctGraphJSON = JSON.stringify(fctGraph)
// -> returns valid JSON with no information lost

const fctGraphClone = FCTGraph.new(JSON.parse(fctGraphJSON))
// -> works!
```

---

## <a name="ClassStructureAndHierarchies"></a>Class Structure and Hierarchies


```js
FCTGraph

// an FCTGraph has many Functionalities
Functionality (virtual)
├── Actuator (virtual)
│   └── HeaterActuator
├── Controller (virtual)
│   └── PIDController
├── InputNode (virtual)
│   └── PushIn
├── OutputNode (virtual)
│   ├── PushOut
│   └── IntervalOut
└── Sensor (virtual)
    └── TemperatureSensor

// a Functionality has many Slots
Slot (virtual)
├── InSlot
└── OutSlot

// a Slot has many DataStreams
DataStream
```

All non-virtual classes (e.g. HeaterActuator, InSlot, etc.) compose the **JOIous** module, which provides the following:
- **post .constructor** - asserts the instance's data against the JOI SCHEMA (which provides nested data validation) as a final step
- **.serialize** (virtual) - blows up - informing the user that the class that composed JOIous needs a `.serialize` method
- **.sortAndSerialize** - uses .serialize returns the (deeply) sorted object
- **.toJSON** - uses .sortAndSerialize
- **.toString** - inspects deeply for richer print outs
- **[util.inspect.custom]** - inspects deeply for richer print outs in Node

---

## <a name="Factories"></a>Factories

Functionalities and Slots need somewhat intelligent instantiation as they are meant to be serialized to and from JSON. For this reason, Factories exist for instantiating both Functionalities and Slots. Instantiating an FCTGraph from parsed JSON will automatically delegate to the factories as it builds the hierarchy.

- **FCTGraph** delegates to the **FunctionalityFactory** when functionalities are added. The factory will attempt to find the appropriate functionality sub-class via the `type` and `subType` key values and blow up if it can not find one.

- **Functionality** delegates to the **SlotFactory** when slots are added. The factory will attempt to find the appropriate slot sub-class via the `type` key value and blow up if it can not find one.

**Functionalities** and **Slots** can also be created directly calling the constructors on their non-virtual classes. See [Class Structure and Hierarchies](#ClassStructureAndHierarchies)

---

## <a name="Seeders"></a>Seeders

> **NOTE:** Seeders are meant for testing purposes ONLY. While they carry a high test coverage %, they (likely) don't have the 100% Green™ coverage that the rest does.

The package comes with seeders which have the same class hierarchy as the primary models:
```js
FCTGraphSeeder

FunctionalitySeeder (virtual)
├── ActuatorSeeder (virtual)
│   └── HeaterActuatorSeeder
├── ControllerSeeder (virtual)
│   └── PIDControllerSeeder
├── InputNodeSeeder (virtual)
│   └── PushInSeeder
├── OutputNodeSeeder (virtual)
│   ├── PushOutSeeder
│   └── IntervalOutSeeder
└── SensorSeeder (virtual)
    └── TemperatureSensorSeeder

SlotSeeder (virtual)
├── InSlotSeeder
└── OutSlotSeeder
```

All virtual seeders (e.g. HeaterActuatorSeeder, InSlotSeeder etc.) compose the **FactorySeeder** module, which provides the following static methods (which extend to their children):
- **static get SEED_METHOD** (virtual) - blows up - informing the user that the class that composed FactorySeeder needs a static `.SEED_METHOD` getter. This method should used to call a constructor/factory's creation method
- **static generate** (virtual) - blows up - informing the user that the class that composed FactorySeeder needs a static `.generate` method. This method should be used to create fake data which matches the class SCHEMA
- **.seedOne** - expects a data object. delegates to `generate` and `SEED_METHOD`
- **.seedMany** - expects an array of data objects
- **.seedN** - expects an object and a count

---

## Contributing

This repo employs the github action [semantic-release](https://semantic-release.gitbook.io/semantic-release/), which, on approved PRs to `main`, sniffs the PR title/commit message to automatically bump the semantic versioning and publish the package to NPM.

[All PRs to the `main` branch should indicate the semantic version change via the following rules](https://semantic-release.gitbook.io/semantic-release/#commit-message-format).

---

## Upcoming:
- reject setting properties on the core classes that should not change throughout the lifetime of an object (`type`, `subType`, `name`, etc.)
- disconnect connections between slots
- dataStreams reference slots instead of just the slot name (works with instantiating from slot name) and still serialize to contain the slot names
