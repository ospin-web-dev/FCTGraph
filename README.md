[![codecov](https://codecov.io/gh/ospin-web-dev/FCTGraph/branch/master/graph/badge.svg)](https://codecov.io/gh/ospin-web-dev/FCTGraph)
[![Maintainability](https://api.codeclimate.com/v1/badges/ab083cc74a1fbb1d7319/maintainability)](https://codeclimate.com/repos/60ae147b04beeb018b015a77/maintainability)

## Table of Contents

- [Use Overview](#UseOverview)
  - [Instantiation](#Instantiation)
  - [Action](#Action)
  - [Inspection](#Inspection)
  - [From/To JSON](#FromAndToJson)
- [Class Structure and Hierarchies](#ClassStructureAndHierarchies)
- [Seeders](#Seeders)


## <a name="Overview"></a>Overview

This documentation is likely to remain sparse, as it is for internal use and under development.

todo: mention instantiation from JSON
todo below: mention general structure
  - heirarchies
  - mixins
todo below: mention seeder structure below

The following is a selected showcase of the public functions on the various base objects of:
- **FCTGraph** (graph)
- **Functionality** (node)
- **Slot** (connection rule object)
- **DataStream** (edge)

#### <a name="Instantiation">Instantiation!
```js
// create functionality graphs directly from JSON.stringify-able objects!

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

## FAQ
---

---

## Commit Message Guidelines

This repo is set up with semantic versioning https://semantic-release.gitbook.io/semantic-release/ to automatically keep track of the version number and the changelogs

All merged pull request need to indicate the level of change (fix,feat,perf)

## TODO:
- reject setting any properties that can not change throughout the lifetime of an object (types, etc.)
- disconnect
- dataStreams reference slots instead of name (works with instantiating from slotname) and serialize to slot names
