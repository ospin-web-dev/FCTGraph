[![codecov](https://codecov.io/gh/ospin-web-dev/FCTGraph/branch/main/graph/badge.svg?token=RXXLX0HDAR)](https://codecov.io/gh/ospin-web-dev/FCTGraph)
[![Maintainability](https://api.codeclimate.com/v1/badges/184840b3c795f19f837b/maintainability)](https://codeclimate.com/github/ospin-web-dev/FCTGraph/maintainability)

This documentation is likely to remain sparse, as it is for internal use and under development!

---

## Table of Contents

- [Use Overview](#UseOverview)
  - [Instantiation](#Instantiation)
  - [Action](#Action)
  - [Inspection](#Inspection)
  - [From/To JSON](#FromAndToJson)
  - [Public Methods that Mutate](#PublicMethodsThatMutate)
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
fctGraph.addFunctionalityByData({ ...heaterActuatorData })

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
const { dataStream } = tempOutSlot.connectTo(connectableSlot)
// -> dataStream { id, sourceSlot: tempOutSlot, sinkSlot: connectableSlot, ... }
```

#### <a name="Inspection">Inspection!
```js
// ...continuing from above
tempSensor.isPossibleToConnectToFct(pidController)
// -> true

fctGraph.getConnectableFctsToTargetFct(pidController)
// -> [ tempSensor, ... ]
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

#### <a name="PublicMethodsThatMutate">Public Methods that Mutate

Where appropriate (and hopefully whenever this package is extended) public methods which mutate instances in a major way (e.g. adding functionalities to the graph, connecting slots, etc.) return a response object. Response objects are intended to be useful in cases where a caller attempts to mutate the FCTGraph (or a portion of it) in a way that would ultimately fail data validation. The response objects will return actionable information for the caller instead of blowing up outright.

```js
const failure = fctGraph.addFunctionalityByData({ name: 123, ...validData })
// {
//   error: true,
//   errorMsg: 'Failed to add fct: <fct data>. Underlying error: name must be a string',
//   functionality: <{ ...the failed functionalities data }>,
// }

const success = fctGraph.addFunctionalityByData({ name: 'Dr. Strangelove\'s Bunker Heater', ...validData })
// {
//   error: false,
//   errorMsg: null,
//   functionality: <the added functionality>,
// }
```

---

## <a name="ClassStructureAndHierarchies"></a>Class Structure and Hierarchies


```js
FCTGraph
FCTGraphUtils TODO: UPDATE THIS

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
├── InSlot (virtual)
│   └── IntegerInSlot
│   └── FloatInSlot
│   └── BooleanInSlot
│   └── OneOfInSlot
└── OutSlot (virtual)
    └── IntegerOutSlot
    └── FloatOutSlot
    └── BooleanOutSlot
    └── OneOfOutSlot

// a Slot has many DataStreams
DataStream
```

All non-virtual classes (e.g. HeaterActuator, IntegerInSlot, etc.) compose the **JOIous** module, which provides the following:
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

- **Functionality** delegates to the **SlotFactory** when slots are added. The factory will attempt to find the appropriate slot sub-class via the `type` and `dataType` key value and blow up if it can not find one.

**Functionalities** and **Slots** can also be created directly calling the constructors on their non-virtual classes. See [Class Structure and Hierarchies](#ClassStructureAndHierarchies)

---

## <a name="Seeders"></a>Seeders

> **NOTE:** Seeders are meant for testing purposes ONLY. While they carry a high test coverage %, they (likely) don't have the 100% Green™ coverage that the rest does.

The package comes with seeders which have the same class hierarchy as the primary models:
```js
FCTGraphSeeder

FunctionalitySeeder (virtual)
├── ActuatorSeeder (virtual)
│   ├── HeaterActuatorSeeder
│   └── UnknownActuatorSeeder
├── ControllerSeeder (virtual)
│   └── PIDControllerSeeder
├── InputNodeSeeder (virtual)
│   └── PushInSeeder
├── OutputNodeSeeder (virtual)
│   ├── PushOutSeeder
│   └── IntervalOutSeeder
└── SensorSeeder (virtual)
    ├── TemperatureSensorSeeder
    └── UnknownSensorSeeder

SlotSeeder (virtual)
├── RandomSlotSeeder (picks from a SlotSeeder below)
├── InSlotSeeder (virtual)
│   └── IntegerInSlotSeeder
│   └── FloatInSlotSeeder
│   └── BooleanInSlotSeeder
│   └── OneOfInSlotSeeder
└── OutSlotSeeder (virtual)
    └── IntegerOutSlotSeeder
    └── FloatOutSlotSeeder
    └── BooleanOutSlotSeeder
    └── OneOfOutSlotSeeder
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

All PRs to the `main` branch should indicate the semantic version change via the following options:

Available types:
 - feat: A new feature
 - fix: A bug fix
 - docs: Documentation only changes
 - style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
 - refactor: A code change that neither fixes a bug nor adds a feature
 - perf: A code change that improves performance
 - test: Adding missing tests or correcting existing tests
 - build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
 - ci: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
 - chore: Other changes that don't modify src or test files
 - revert: Reverts a previous commit

---

## Upcoming:
- reject setting properties on the core classes that should not change throughout the lifetime of an object (`type`, `subType`, `name`, etc.)
- disconnect connections between slots

