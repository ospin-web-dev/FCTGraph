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
- [FCTGraph Utils](#FCTGraphUtils)
- [Factories](#Factories)
- [Seeders](#Seeders)
- [Contributing](#Contributing)
- [Upcoming](#Upcoming)

---

## <a name="UseOverview"></a>Use Overview

The FCTGraph functions like a traditional graph with several features on top. Most importantly, all functionalities (nodes) have many slots, which determine what kind of data flows out of, and can flow in to, a functionality. Slots connect to other slots (if they are compatible) via dataStreams (edges).

The following is a selected showcase of the public functions on the various base objects of:
- **FCTGraph** (graph)
- **Functionality** (node - connects to other functionalities via slots)
- **Slot** (functionalities I/O + connection rule object)
- **DataStream** (edge - connects to slots)

#### <a name="Instantiation">Instantiation!
> NOTE: FCTGraphs will instantiate from deeply nested objects, reading down from the top level.
> - an `fctGraph` has many `.functionalities`
> - a `functionality` has many `.slots`
> - a `slot` has many `.dataStreams`

```js
const { FCTGraph, functionalities, slots } = require('@ospin/fct-graph') // or import

// first, let's set up some seed data. Functionalities (nodes) have many dataStreams (edges)...
const tempOutSlotData = { name: 'temp out', type: 'OutSlot', ... } /* see OutSlot.SCHEMA */
const tempSensorData = { slots: [ tempOutSlotData ], ... } /* see TemperatureSensor.SCHEMA */

const tempInSlotData = { name: 'temp in', type: 'InSlot', ... } /* see InSlot.SCHEMA */
const pidControllerData = { slots: [ tempInSlotData ], ... }  /* see PIDController.SCHEMA */

// ...and instantiate our FCTGraph
const fctGraph = FCTGraph.assertValidDataAndNew({
  functionalities: [ tempSensorData, pidControllerData ],
  ..., /* see FCTGraph.SCHEMA */
})

// we can also add functionalities after the fact
fctGraph.addFunctionalityByData({ ...heaterActuatorData })

fctGraph.functionalities
// -> a temperature sensor with a temperature outslot
// -> a PID controller with a temperature in slot
// -> a heater actuator
```

Alternative instantiation with dataStreams passed in as a top level key on the fctGraph data:

```js
const fctGraph = new FCTGraph({
  functionalities: [ tempSensorData, pidControllerData ],
  dataStreams: [ dataStreamData, ... ],
  ..., /* see FCTGraph.SCHEMA */
})

/* NOTE: if Datastreams are found in the dataStreams array, only
 * they will be added. Any nested dataStream data in the slots
 * will be ignored! */
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

// an FCTGraph has many Functionalities
Functionality (virtual)
├── Actuator (virtual)
│   ├── HeaterActuator
│   ├── StirrerActuator
│   │   ├── HeidolphOverheadStirrer
│   │   └── HeidolphMagneticStirrer
│   ├── PumpActuator
│   ├── HeidolphPump
│   └── UnknownActuator
├── Controller (virtual)
│   ├── PHControllerHeidolphPumps
│   └── PIDController
├── InputNode (virtual)
│   └── PushIn
├── OutputNode (virtual)
│   ├── PushOut
│   └── IntervalOut
└── Sensor (virtual)
    ├── TemperatureSensor
    ├── PHSensor
    │   └── HamiltonPHArcSensor
    └── UnknownSensor

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
- **`static assertValidDataAndNew`** - uses the constructor and asserts the instance's data against the JOI SCHEMA (which provides nested data validation) as a final step. This used to be the default behavior for every JOIous constructor, but JOI was significantly slowing down the construction of large FCTGraphs from JSON -> instances. This is now best used on an `FCTGraph`'s instantiation at critical moments, e.g. before persisting to the DB after receiving JSON, when instantiating new functionalities/dataStreams from user provided data, etc. Whenever speed is _not_ a critical concern or data fidelity is _not_ guaranteed, use `assertValidDataAndNew` instead of the `.new` method
- **`.serialize`** (virtual) - blows up - informing the user that the class that composed JOIous needs a `.serialize` method
- **`.sortAndSerialize`** - uses `.serialize` returns the (deeply) sorted object
- **`.toJSON`** - uses `.sortAndSerialize`
- **`.toString`** - inspects deeply for richer print outs

---

## <a name="FCTGraphUtils"></a>FCTGraph Utils

The FCTGraph has a pretty big appetite for specific and involved mutation methods and queries. To accommodate this, while avoiding class bloat, there exist FCTGraph Utils. The Utils are a collecting place for mutators, predicates, and anything else related that is not considered 'core' enough functionality to exist on the classes directly.

```js
const {
  FCTGraph,
  FCTGraphUtils: {
    mutators: { addPushOutFctForAllOutSlotsWhichHaveNone },
    predicates: { fctGraphsAreSameWithoutIONodes },
  }
} = require('@ospin/fct-graph')

const fctGraph = new FCTGraph(/* bunch-o fctGraph data */)

addPushOutFctForAllOutSlotsWhichHaveNone(fctGraph) // mutates the graph
```

---
## <a name="Factories"></a>Factories

Functionalities and Slots need somewhat intelligent instantiation as they are meant to be serialized to and from JSON. For this reason, Factories exist for instantiating both Functionalities and Slots. Instantiating an FCTGraph from parsed JSON will automatically delegate to the factories as it builds the hierarchy.

- **FCTGraph** delegates to the **FunctionalityFactory** when functionalities are added. The factory will attempt to find the appropriate functionality sub-class via the `type` and `subType` key values and blow up if it can not find one.

- **Functionality** delegates to the **SlotFactory** when slots are added. The factory will attempt to find the appropriate slot sub-class via the `type` and `dataType` key value and blow up if it can not find one.

**Functionalities** and **Slots** can also be created directly calling the constructors on their non-virtual classes. See [Class Structure and Hierarchies](#ClassStructureAndHierarchies)

---

## <a name="Seeders"></a>Seeders

> **NOTE:** Seeders are meant for testing purposes ONLY. While they carry a high test coverage percentage, they (likely) don't have the 100% Green™ coverage that the rest does.

The package comes with seeders which have the same class hierarchy as the primary models. A seeder exists for every [non-virtual functionality and slot](#ClassStructureAndHierarchies). The seeder modules are named after the classes, e.g. `PIDControllerSeeder` or `BooleanInSlotSeeder`. Refer to the [Class Structure and Hierarchies](#ClassStructureAndHierarchies) above for the full list of functionalities and slots. Following is an example of the seeder heirarchy:
```js
FCTGraphSeeder

FunctionalitySeeder (virtual)
├── ActuatorSeeder (virtual)
│   ├── HeaterActuatorSeeder
│   ├── StirrerActuatorSeeder
│   │   ├── HeidolphOverheadStirrerSeeder
│   │   └── ...
│   └── ...
└── ...

SlotSeeder (virtual)
├── RandomSlotSeeder (picks from a SlotSeeder below)
├── InSlotSeeder (virtual)
│   └── IntegerInSlotSeeder
│   ├── FloatInSlotSeeder
│   └── ...
└── OutSlotSeeder (virtual)
    ├── IntegerOutSlotSeeder
    └── ...
```

...accessing seeders from the public interface:

```js
const {
  functionalitySeeders: { StirrerActuatorSeeder },
  slotSeeders: { FloatInSlotSeeder },
} = require('@ospin/fct-graph') // or import

const stirrerActuator = StirrerActuatorSeeder.seedOne() // <- instance
stirrerActuator.isPhysical() // -> true
```

All virtual seeders (e.g. HeaterActuatorSeeder, InSlotSeeder etc.) compose the **FactorySeeder** module, which provides the following static methods (which extend to their children):
- **static get SEED_METHOD** (abstract) - blows up - informing the user that the class that composed FactorySeeder needs a static `.SEED_METHOD` getter. This method should be used to call a constructor/factory's creation method
- **static generate** (abstract) - blows up - informing the user that the class that composed FactorySeeder needs a static `.generate` method. This method should be used to create fake data which matches the class SCHEMA
- **static seedOne** - expects a data object. delegates to `generate` and `SEED_METHOD`
- **static seedMany** - expects an array of data objects
- **static seedN** - expects an object and a count

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

[More info and how to bump major version found here](https://www.conventionalcommits.org/en/v1.0.0/)

---
