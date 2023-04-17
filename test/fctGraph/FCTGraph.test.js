const faker = require('faker')

const FCTGraph = require('../../src/fctGraph/FCTGraph')
const Slot = require('../../src/slots/Slot')
const Functionality = require('../../src/functionalities/Functionality')

const FCTGraphSeeder = require('../../src/seeders/fctGraph/FCTGraphSeeder')
const FunctionalitySeeder = require('../../src/seeders/functionalities/FunctionalitySeeder')
const SlotSeeder = require('../../src/seeders/slots/SlotSeeder')
const DataStreamSeeder = require('../../src/seeders/dataStreams/DataStreamSeeder')

describe('FCTGraph', () => {

  describe('create', () => {
    it('sets all default values', () => {
      const data = {
        id: faker.datatype.uuid(),
        deviceId: faker.datatype.uuid(),
        name: faker.random.word(),
      }

      const res = FCTGraph.create(data)

      expect(res).toStrictEqual(expect.objectContaining({
        functionalities: [],
        imageURL: null,
        templateId: null,
      }))
    })
  })

  describe('update', () => {
    it('updates the fctGraph', () => {
      const graph = FCTGraphSeeder.generate()
      const update = { functionalities: [ FunctionalitySeeder.generate() ] }

      const updatedGraph = FCTGraph.update(graph, update)

      expect(updatedGraph).toStrictEqual(expect.objectContaining(update))
    })
  })

  describe('getFctById', () => {
    it('returns the fct', () => {
      const fct = FunctionalitySeeder.generate()
      const graph = FCTGraphSeeder.generate({ functionalities: [ fct ] })

      const res = FCTGraph.getFctById(graph, fct.id)

      expect(res).toStrictEqual(fct)
    })
  })

  describe('getFctByPosId', () => {
    it('returns the fct', () => {
      const fct = FunctionalitySeeder.generate({ posId: 1 })
      const graph = FCTGraphSeeder.generate({ functionalities: [ fct ] })

      const res = FCTGraph.getFctByPosId(graph, 1)

      expect(res).toStrictEqual(fct)
    })
  })

  describe('when querying for mutliple functionalities', () => {

    const createDefaultSetup = () => {
      const pushIn = FunctionalitySeeder.generatePushIn({ name: 'A' })
      const intervalOut = FunctionalitySeeder.generateIntervalOut({ name: 'B' })
      const sensor = FunctionalitySeeder.generateSensor({ name: 'C' })
      const actuator = FunctionalitySeeder.generateActuator({ name: 'D' })
      const graph = FCTGraphSeeder
        .generate({ functionalities: [ pushIn, intervalOut, sensor, actuator ] })

      return { graph, pushIn, intervalOut, sensor, actuator }
    }

    describe('getFctsWithoutIONodes', () => {
      it('returns all non-IO fcts', () => {
        const { graph, actuator, sensor } = createDefaultSetup()

        const res = FCTGraph.getFctsWithoutIONodes(graph)

        expect(res).toHaveLength(2)
        expect(res).toStrictEqual(expect.arrayContaining([sensor, actuator]))
      })
    })

    describe('getPushInFcts', () => {
      it('returns all PushIn fcts', () => {
        const { graph, pushIn } = createDefaultSetup()

        const res = FCTGraph.getPushInFcts(graph)

        expect(res).toHaveLength(1)
        expect(res).toStrictEqual(expect.arrayContaining([pushIn]))
      })
    })

    describe('getIntervalOutFcts', () => {
      it('returns all IntervalOut fcts', () => {
        const { graph, intervalOut } = createDefaultSetup()

        const res = FCTGraph.getIntervalOutFcts(graph)

        expect(res).toHaveLength(1)
        expect(res).toStrictEqual(expect.arrayContaining([intervalOut]))
      })
    })

    describe('getPhysicalFcts', () => {
      it('returns all IntervalOut fcts', () => {
        const { graph, sensor, actuator } = createDefaultSetup()

        const res = FCTGraph.getPhysicalFcts(graph)

        expect(res).toHaveLength(2)
        expect(res).toStrictEqual(expect.arrayContaining([sensor, actuator]))
      })
    })

    describe('getVirtualFcts', () => {
      it('returns all IntervalOut fcts', () => {
        const { graph, intervalOut, pushIn } = createDefaultSetup()

        const res = FCTGraph.getVirtualFcts(graph)

        expect(res).toHaveLength(2)
        expect(res).toStrictEqual(expect.arrayContaining([intervalOut, pushIn]))
      })
    })

    describe('getFctsByType', () => {
      it('returns all fcts matching the type', () => {
        const { graph, sensor } = createDefaultSetup()

        const res = FCTGraph.getFctsByType(graph, sensor.type)

        expect(res).toHaveLength(1)
        expect(res).toStrictEqual(expect.arrayContaining([sensor]))
      })
    })
  })

  describe('getAllDataStreams', () => {
    it('returns all datastreams of graph', () => {
      const ds1 = DataStreamSeeder.generate()
      const ds2 = DataStreamSeeder.generate()

      const slot1 = SlotSeeder.generateIntegerInSlot({ dataStreams: [ ds1 ] })
      const slot2 = SlotSeeder.generateIntegerInSlot({ dataStreams: [ ds2 ] })

      const fct1 = FunctionalitySeeder.generate({ slots: [ slot1 ] })
      const fct2 = FunctionalitySeeder.generate({ slots: [ slot2 ] })

      const graph = FCTGraphSeeder.generate({ functionalities: [ fct1, fct2 ] })

      const res = FCTGraph.getAllDataStreams(graph)

      expect(res).toHaveLength(2)
      expect(res).toStrictEqual(expect.arrayContaining([ds1, ds2]))
    })
  })

  describe('getAllUniqueDataStreams', () => {
    it('returns all all unqiue datastreams of graph', () => {
      const ds1 = DataStreamSeeder.generate()

      const slot1 = SlotSeeder.generateIntegerInSlot({ dataStreams: [ ds1 ] })
      const slot2 = SlotSeeder.generateIntegerOutSlot({ dataStreams: [ ds1 ] })

      const fct1 = FunctionalitySeeder.generate({ slots: [ slot1 ] })
      const fct2 = FunctionalitySeeder.generate({ slots: [ slot2 ] })

      const graph = FCTGraphSeeder.generate({ functionalities: [ fct1, fct2 ] })

      const res = FCTGraph.getAllUniqueDataStreams(graph)

      expect(res).toHaveLength(1)
      expect(res).toStrictEqual(expect.arrayContaining([ds1]))
    })
  })

  describe('when connecting functionalities', () => {

    const createDefaultSetup = (slotData1 = {}, slotData2 = {}) => {
      const slot1 = SlotSeeder.generateBooleanInSlot({ unit: 'rpm', ...slotData1 })
      const slot2 = SlotSeeder.generateBooleanOutSlot({ unit: 'rpm', ...slotData2 })

      const fct1 = FunctionalitySeeder.generate({ slots: [ slot1 ] })
      const fct2 = FunctionalitySeeder.generate({ slots: [ slot2 ] })

      const graph = FCTGraphSeeder.generate({ functionalities: [ fct1, fct2 ] })

      return { graph, fct1, slot1, fct2, slot2 }
    }

    describe('connect', () => {
      it('creates a data stream in the involved slots', () => {
        const { graph, fct1, fct2, slot1, slot2 } = createDefaultSetup()

        const connected = FCTGraph.connect(graph, fct1.id, slot1.name, fct2.id, slot2.name)

        expect(connected.functionalities[0].slots[0].dataStreams[0]).toBeDefined()
        expect(connected.functionalities[0].slots[0].dataStreams[0])
          .toStrictEqual(connected.functionalities[1].slots[0].dataStreams[0])
      })

      describe('when the slot units are different', () => {
        describe('when none of the units is the "any" unit', () => {
          it('throws an error', () => {
            const { graph, fct1, fct2, slot1, slot2 } = createDefaultSetup(
              { unit: 'rpm' },
              { unit: '%' },
            )

            expect(() => FCTGraph.connect(graph, fct1.id, slot1.name, fct2.id, slot2.name))
              .toThrow(/units must match/)
          })
        })

        describe('when one of the units is the "any" unit', () => {
          it('does NOT throw an error', () => {
            const { graph, fct1, fct2, slot1, slot2 } = createDefaultSetup(
              { unit: 'rpm' },
              { unit: Slot.ANY_UNIT_STRING },
            )

            expect(() => FCTGraph.connect(graph, fct1.id, slot1.name, fct2.id, slot2.name))
              .not.toThrow()
          })
        })
      })

      describe('when the slot types are equal', () => {
        it('throws an error', () => {
          const { graph, fct1, fct2, slot1, slot2 } = createDefaultSetup(
            { type: Slot.TYPES.IN_SLOT },
            { type: Slot.TYPES.IN_SLOT },
          )

          expect(() => FCTGraph.connect(graph, fct1.id, slot1.name, fct2.id, slot2.name))
            .toThrow(/must have complimentary types/)
        })
      })

      describe('when the slot dataTypes are different', () => {
        describe('when none of the dataTypes is "any"', () => {
          it('throws an error', () => {
            const slot1 = SlotSeeder.generateIntegerInSlot({ unit: 'rpm' })
            const slot2 = SlotSeeder.generateFloatOutSlot({ unit: 'rpm' })

            const fct1 = FunctionalitySeeder.generate({ slots: [ slot1 ] })
            const fct2 = FunctionalitySeeder.generate({ slots: [ slot2 ] })

            const graph = FCTGraphSeeder.generate({ functionalities: [ fct1, fct2 ] })

            expect(() => FCTGraph.connect(graph, fct1.id, slot1.name, fct2.id, slot2.name))
              .toThrow(/dataTypes must match/)
          })
        })

        describe('when one of the dataTypes is "any"', () => {
          it('does NOT throw an error', () => {
            const slot1 = SlotSeeder.generateBooleanInSlot()
            const slot2 = SlotSeeder.generateAnyOutSlot()

            const fct1 = FunctionalitySeeder.generate({ slots: [ slot1 ] })
            const fct2 = FunctionalitySeeder.generate({ slots: [ slot2 ] })

            const graph = FCTGraphSeeder.generate({ functionalities: [ fct1, fct2 ] })

            expect(() => FCTGraph.connect(graph, fct1.id, slot1.name, fct2.id, slot2.name))
              .not.toThrow()
          })
        })

        describe.each([{
          name: 'Float',
          inSlotGenerator: data => SlotSeeder.generateFloatInSlot(data),
          outSlotGenerator: data => SlotSeeder.generateFloatOutSlot(data),
        }, {
          name: 'Integer',
          inSlotGenerator: data => SlotSeeder.generateIntegerInSlot(data),
          outSlotGenerator: data => SlotSeeder.generateIntegerOutSlot(data),
        }])(
          'when generating a $name and connecting it to a any_number slot',
          ({ inSlotGenerator, outSlotGenerator }) => {
            it('does NOT throw an error', () => {
              const slotA1 = inSlotGenerator()
              const slotA2 = SlotSeeder.generateNumberOutSlot()
              const slotB1 = outSlotGenerator()
              const slotB2 = SlotSeeder.generateNumberInSlot()

              const fct1 = FunctionalitySeeder.generate({ slots: [ slotA1, slotB1 ] })
              const fct2 = FunctionalitySeeder.generate({ slots: [ slotA2, slotB2 ] })

              const graph = FCTGraphSeeder.generate({ functionalities: [ fct1, fct2 ] })

              expect(() => FCTGraph.connect(graph, fct1.id, slotA1.name, fct2.id, slotA2.name))
                .not.toThrow()
              expect(() => FCTGraph.connect(graph, fct1.id, slotB1.name, fct2.id, slotB2.name))
                .not.toThrow()
            })
          },
        );
      })

      describe('when the slots already have a connection', () => {
        it('throws an error', () => {
          const { graph, fct1, fct2, slot1, slot2 } = createDefaultSetup()

          const alreadyConnectedGraph = FCTGraph
            .connect(graph, fct1.id, slot1.name, fct2.id, slot2.name)

          expect(() => FCTGraph
            .connect(alreadyConnectedGraph, fct1.id, slot1.name, fct2.id, slot2.name))
            .toThrow(/slots are already connected/)
        })
      })

      describe('when the InSlot already has a connection', () => {
        it('throws an error', () => {
          const slot1 = SlotSeeder.generateIntegerInSlot({ unit: 'rpm' })
          const slot2 = SlotSeeder.generateIntegerOutSlot({ unit: 'rpm', name: 'A' })
          const slot3 = SlotSeeder.generateIntegerOutSlot({ unit: 'rpm', name: 'B' })

          const fct1 = FunctionalitySeeder.generate({ slots: [ slot1 ] })
          const fct2 = FunctionalitySeeder.generate({ slots: [ slot2, slot3 ] })

          const graph = FCTGraphSeeder.generate({ functionalities: [ fct1, fct2 ] })

          const alreadyConnectedGraph = FCTGraph
            .connect(graph, fct1.id, slot1.name, fct2.id, slot2.name)

          expect(() => FCTGraph
            .connect(alreadyConnectedGraph, fct1.id, slot1.name, fct2.id, slot3.name))
            .toThrow(/InSlot can only have a single dataStream/)
        })
      })

      describe.each([
        { dataType: 'Integer', averagingWindowSize: 0 },
        { dataType: 'Float', averagingWindowSize: 0 },
        { dataType: 'Boolean', averagingWindowSize: 1 },
        { dataType: 'OneOf', averagingWindowSize: 1 },
        { dataType: 'Any', averagingWindowSize: 1 },
      ])('for $dataType slots', ({ dataType, averagingWindowSize }) => {
        it(`set the averagingWindowSize for the datastream to ${averagingWindowSize}`, () => {
          const slot1 = SlotSeeder[`generate${dataType}InSlot`]({ unit: 'rpm' })
          const slot2 = SlotSeeder[`generate${dataType}OutSlot`]({ unit: 'rpm' })

          const fct1 = FunctionalitySeeder.generate({ slots: [ slot1 ] })
          const fct2 = FunctionalitySeeder.generate({ slots: [ slot2 ] })

          const graph = FCTGraphSeeder.generate({ functionalities: [ fct1, fct2 ] })

          const connectedGraph = FCTGraph
            .connect(graph, fct1.id, slot1.name, fct2.id, slot2.name)

          expect(connectedGraph.functionalities[0].slots[0].dataStreams[0].averagingWindowSize)
            .toBe(averagingWindowSize)
        })
      })
    })

    describe('when connecting an intervalOut functionality', () => {
      describe('when the other functionality has a "outputIntervalMs" set', () => {
        it('sets the publishIntervalMs to mirror the outputIntervalMs', () => {
          const intervalOut = FunctionalitySeeder.generateIntervalOut()
          const slot = SlotSeeder.generateFloatOutSlot()
          const outputIntervalMs = faker.datatype.number()
          const fct = FunctionalitySeeder.generate({
            slots: [ slot ],
            outputIntervalMs,
          })

          const graph = FCTGraphSeeder.generate({ functionalities: [ intervalOut, fct ] })

          const connectedOneWay = FCTGraph
            .connect(graph, intervalOut.id, intervalOut.slots[0].name, fct.id, slot.name)

          expect(FCTGraph.getIntervalOutFcts(connectedOneWay)[0].publishIntervalMs)
            .toBe(outputIntervalMs)

          const connectedTheOtherWay = FCTGraph
            .connect(graph, fct.id, slot.name, intervalOut.id, intervalOut.slots[0].name)

          expect(FCTGraph.getIntervalOutFcts(connectedTheOtherWay)[0].publishIntervalMs)
            .toBe(outputIntervalMs)
        })
      })

      describe('when the other functionality has NO "outputIntervalMs" set', () => {
        it('sets the publishIntervalMs to default', () => {
          const intervalOut = FunctionalitySeeder.generateIntervalOut()
          const slot = SlotSeeder.generateFloatOutSlot()
          const fct = FunctionalitySeeder.generate({ slots: [ slot ] })

          const graph = FCTGraphSeeder.generate({ functionalities: [ intervalOut, fct ] })

          const connectedOneWay = FCTGraph
            .connect(graph, intervalOut.id, intervalOut.slots[0].name, fct.id, slot.name)

          expect(FCTGraph.getIntervalOutFcts(connectedOneWay)[0].publishIntervalMs)
            .toBe(1000)

          const connectedTheOtherWay = FCTGraph
            .connect(graph, fct.id, slot.name, intervalOut.id, intervalOut.slots[0].name)

          expect(FCTGraph.getIntervalOutFcts(connectedTheOtherWay)[0].publishIntervalMs)
            .toBe(1000)
        })
      })
    })
  })

  describe('when querying connected functionalities', () => {

    const createDefaultSetup = (slotData1 = {}, slotData2 = {}) => {
      const fctSlot1 = SlotSeeder.generateIntegerInSlot({ name: 'A', ...slotData1 })
      const fctSlot2 = SlotSeeder.generateIntegerOutSlot({ name: 'B', ...slotData2 })
      const pushInSlot = SlotSeeder.generateAnyOutSlot()
      const intervalOutSlot = SlotSeeder.generateAnyInSlot()

      const fct = FunctionalitySeeder.generate({ slots: [ fctSlot1, fctSlot2 ] })
      const pushIn = FunctionalitySeeder.generatePushIn({ slots: [ pushInSlot ] })
      const intervalOut = FunctionalitySeeder.generateIntervalOut({ slots: [ intervalOutSlot ] })

      const graph = FCTGraphSeeder.generate({ functionalities: [ fct, pushIn, intervalOut ] })
      const graphWithOneConnection = FCTGraph
        .connect(graph, fct.id, fctSlot1.name, pushIn.id, pushInSlot.name)

      const fullyConnectedGraph = FCTGraph.connect(
        graphWithOneConnection, fct.id, fctSlot2.name, intervalOut.id, intervalOutSlot.name)

      const fctFinal = FCTGraph.getFctById(fullyConnectedGraph, fct.id)
      const fctSlot1Final = fctFinal.slots[0]
      const fctSlot2Final = fctFinal.slots[1]

      const pushInFinal = FCTGraph.getFctById(fullyConnectedGraph, pushIn.id)
      const pushInSlotFinal = pushInFinal.slots[0]

      const intervalOutFinal = FCTGraph.getFctById(fullyConnectedGraph, intervalOut.id)
      const intervalOutSlotFinal = intervalOutFinal.slots[0]

      return {
        graph: fullyConnectedGraph,
        fct: fctFinal,
        fctSlot1: fctSlot1Final,
        fctSlot2: fctSlot2Final,
        pushIn: pushInFinal,
        pushInSlot: pushInSlotFinal,
        intervalOut: intervalOutFinal,
        intervalOutSlot: intervalOutSlotFinal,
      }
    }

    describe('getConnectedFctsForFct', () => {
      it('returns an array of all connected fcts', () => {
        const { fct, pushIn, intervalOut, graph } = createDefaultSetup()

        const res = FCTGraph.getConnectedFctsForFct(graph, fct.id)

        expect(res).toStrictEqual(expect.arrayContaining([pushIn, intervalOut]))
      })
    })

    describe('getConnectedSourcesForFct', () => {
      it('returns an array of all connected fcts with data streams going TO the fct', () => {
        const { fct, pushIn, graph } = createDefaultSetup()

        const res = FCTGraph.getConnectedSourcesForFct(graph, fct.id)

        expect(res).toStrictEqual(expect.arrayContaining([pushIn]))
      })
    })

    describe('getConnectedSinksForFct', () => {
      it('returns an array of all connected fcts with data streams going FROM the fct', () => {
        const { fct, intervalOut, graph } = createDefaultSetup()

        const res = FCTGraph.getConnectedSinksForFct(graph, fct.id)

        expect(res).toStrictEqual(expect.arrayContaining([intervalOut]))
      })
    })

    describe('getSinkFct', () => {
      it('returns the sink fct for an InputNode', () => {
        const { fct, pushIn, graph } = createDefaultSetup()

        const res = FCTGraph.getSinkFct(graph, pushIn.id)

        expect(res).toStrictEqual(fct)
      })

      describe('when used with a fct that is not of type InputNode', () => {
        it('throws an error', () => {
          const { intervalOut, graph } = createDefaultSetup()

          expect(() => FCTGraph.getSinkFct(graph, intervalOut.id)).toThrow(/is only allowed/)
        })
      })
    })

    describe('getConnectingSinkSlot', () => {
      it('returns the sink slot for an InputNode', () => {
        const { fctSlot1, pushIn, graph } = createDefaultSetup()

        const res = FCTGraph.getConnectingSinkSlot(graph, pushIn.id)

        expect(res).toStrictEqual(fctSlot1)
      })

      it('returns undefined when there is no sink fct for a given PushIn', () => {
        const pushIn = FunctionalitySeeder.generatePushIn()
        const graph = FCTGraphSeeder.generate({ functionalities: [ pushIn ] })

        const res = FCTGraph.getConnectingSinkSlot(graph, pushIn.id)

        expect(res).toBeUndefined()
      })
    })

    describe('getSourceFct', () => {
      it('returns the source fct for an OutputNode', () => {
        const { fct, intervalOut, graph } = createDefaultSetup()

        const res = FCTGraph.getSourceFct(graph, intervalOut.id)

        expect(res).toStrictEqual(fct)
      })

      describe('when used with a fct that is not of type OutputNode', () => {
        it('throws an error', () => {
          const { pushIn, graph } = createDefaultSetup()

          expect(() => FCTGraph.getSourceFct(graph, pushIn.id)).toThrow(/is only allowed/)
        })
      })
    })

    describe('getConnectingSourceSlot', () => {
      it('returns the source slot for an OutputNode', () => {
        const { fctSlot2, intervalOut, graph } = createDefaultSetup()

        const res = FCTGraph.getConnectingSourceSlot(graph, intervalOut.id)

        expect(res).toStrictEqual(fctSlot2)
      })

      it('returns undefined when there is no source fct for a given IntervalOut', () => {
        const intervalOut = FunctionalitySeeder.generateIntervalOut()
        const graph = FCTGraphSeeder.generate({ functionalities: [ intervalOut ] })

        const res = FCTGraph.getConnectingSourceSlot(graph, intervalOut.id)

        expect(res).toBeUndefined()
      })
    })

    describe('getReporterFctIdForSlot', () => {
      describe('when the functionality is connected', () => {
        describe('to a OutputNode (aka Reporter)', () => {
          it('returns the intervalOutFctId', () => {
            const { fct, fctSlot2, graph, intervalOut } = createDefaultSetup()

            const res = FCTGraph.getReporterFctIdForSlot(graph, fct.id, fctSlot2.name)

            expect(res).toStrictEqual(intervalOut.id)
          })
        })

        describe('not to a OutputNode (aka Reporter)', () => {
          it('returns null', () => {
            const slot1 = SlotSeeder.generateIntegerOutSlot({ unit: 'rpm' })
            const fct1 = FunctionalitySeeder.generate({ slots: [ slot1 ] })

            const slot2 = SlotSeeder.generateIntegerInSlot({ unit: 'rpm' })
            const fct2 = FunctionalitySeeder.generate({ slots: [ slot2 ] })

            const graph = FCTGraphSeeder.generate({ functionalities: [ fct1, fct2 ] })
            const connected = FCTGraph.connect(graph, fct1.id, slot1.name, fct2.id, slot2.name)

            const res = FCTGraph.getReporterFctIdForSlot(connected, fct1.id, slot1.name)

            expect(res).toBeNull()
          })
        })
      })

      describe('when the functionality is NOT connected', () => {
        it('returns null', () => {
          const slot = SlotSeeder.generateIntegerInSlot()
          const fct = FunctionalitySeeder.generate({ slots: [ slot ] })
          const graph = FCTGraphSeeder.generate({ functionalities: [ fct ] })

          const res = FCTGraph.getReporterFctIdForSlot(graph, fct.id, slot.name)

          expect(res).toBeNull()
        })
      })
    })

    describe('getInputNodeFctIdForSlot', () => {
      describe('when the functionality is connected', () => {
        describe('to an InputNode', () => {
          it('returns the fctId of the PushIn', () => {
            const { fct, fctSlot1, graph, pushIn } = createDefaultSetup()

            const res = FCTGraph.getInputNodeFctIdForSlot(graph, fct.id, fctSlot1.name)

            expect(res).toStrictEqual(pushIn.id)
          })
        })

        describe('not to an InputNode', () => {
          it('returns null', () => {
            const slot1 = SlotSeeder.generateIntegerInSlot({ unit: 'rpm' })
            const fct1 = FunctionalitySeeder.generate({ slots: [ slot1 ] })

            const slot2 = SlotSeeder.generateIntegerOutSlot({ unit: 'rpm' })
            const fct2 = FunctionalitySeeder.generate({ slots: [ slot2 ] })

            const graph = FCTGraphSeeder.generate({ functionalities: [ fct1, fct2 ] })
            const connected = FCTGraph.connect(graph, fct1.id, slot1.name, fct2.id, slot2.name)

            const res = FCTGraph.getInputNodeFctIdForSlot(connected, fct1.id, slot1.name)

            expect(res).toBeNull()
          })
        })
      })

      describe('when the functionality is NOT connected', () => {
        it('returns null', () => {
          const slot = SlotSeeder.generateIntegerInSlot()
          const fct = FunctionalitySeeder.generate({ slots: [ slot ] })
          const graph = FCTGraphSeeder.generate({ functionalities: [ fct ] })

          const res = FCTGraph.getInputNodeFctIdForSlot(graph, fct.id, slot.name)

          expect(res).toBeNull()
        })
      })
    })

    describe('getConnectedSlotsForSlot', () => {
      it('returns all slots that are connected to the given slot', () => {
        const { fct, fctSlot1, graph, pushInSlot } = createDefaultSetup()

        const res = FCTGraph.getConnectedSlotsForSlot(graph, fct.id, fctSlot1.name)

        expect(res).toStrictEqual(expect.arrayContaining([pushInSlot]))
      })
    })

    describe('getConnectedFctsForSlot', () => {
      it('returns all functionalities that are connected to the given slot', () => {
        const { fct, fctSlot1, graph, pushIn } = createDefaultSetup()

        const res = FCTGraph.getConnectedFctsForSlot(graph, fct.id, fctSlot1.name)

        expect(res).toStrictEqual(expect.arrayContaining([pushIn]))
      })
    })

    describe('slotIsConnectedToOutputNode', () => {
      describe('when the slot is connected to an output node', () => {
        it('returns true', () => {
          const { fct, fctSlot2, graph } = createDefaultSetup()

          const res = FCTGraph.slotIsConnectedToOutputNode(graph, fct.id, fctSlot2.name)

          expect(res).toBe(true)
        })
      })

      describe('when the slot is NOT connected to an output node', () => {
        it('returns false', () => {
          const { fct, fctSlot1, graph } = createDefaultSetup()

          const res = FCTGraph.slotIsConnectedToOutputNode(graph, fct.id, fctSlot1.name)

          expect(res).toBe(false)
        })
      })
    })

    describe('slotIsConnectedToInputNode', () => {
      describe('when the slot is connected to an input node', () => {
        it('returns true', () => {
          const { fct, fctSlot1, graph } = createDefaultSetup()

          const res = FCTGraph.slotIsConnectedToInputNode(graph, fct.id, fctSlot1.name)

          expect(res).toBe(true)
        })
      })

      describe('when the slot is NOT connected to an input node', () => {
        it('returns false', () => {
          const { fct, fctSlot2, graph } = createDefaultSetup()

          const res = FCTGraph.slotIsConnectedToInputNode(graph, fct.id, fctSlot2.name)

          expect(res).toBe(false)
        })
      })
    })
  })

  describe('populatePushInNodes', () => {
    it('puts PushIn nodes into all IN_SLOTS that are not connected yet', () => {
      /* fct has two in slots, of which one is already occupied,
       * fct2 has one in slot, that is still free */
      const fctSlot1 = SlotSeeder.generateIntegerInSlot({ name: 'A' })
      const fctSlot2 = SlotSeeder.generateIntegerOutSlot({ name: 'B' })
      const fctSlot3 = SlotSeeder.generateIntegerInSlot({ name: 'C' })

      const fct2Slot = SlotSeeder.generateIntegerInSlot()

      const pushInSlot = SlotSeeder.generateAnyOutSlot()
      const intervalOutSlot = SlotSeeder.generateAnyInSlot()

      const fct = FunctionalitySeeder.generate({ slots: [ fctSlot1, fctSlot2, fctSlot3 ] })
      const fct2 = FunctionalitySeeder.generate({ slots: [ fct2Slot ] })
      const pushIn = FunctionalitySeeder.generatePushIn({ slots: [ pushInSlot ] })
      const intervalOut = FunctionalitySeeder.generateIntervalOut({ slots: [ intervalOutSlot ] })

      const graph = FCTGraphSeeder.generate({ functionalities: [ fct, fct2, pushIn, intervalOut ] })
      const graphWithOneConnection = FCTGraph
        .connect(graph, fct.id, fctSlot1.name, pushIn.id, pushInSlot.name)

      const fullyConnectedGraph = FCTGraph.connect(
        graphWithOneConnection, fct.id, fctSlot2.name, intervalOut.id, intervalOutSlot.name)

      const res = FCTGraph.populatePushInNodes(fullyConnectedGraph)

      expect(res.functionalities
        .filter(aFct => !Functionality.isOutputNode(aFct) && !Functionality.isInputNode(aFct))
        .every(aFct => aFct.slots
          .filter(slot => slot.type === Slot.TYPES.IN_SLOT)
          .every(slot => FCTGraph.slotIsConnectedToInputNode(res, aFct.id, slot.name))))
        .toBe(true)
    })
  })

  describe('populateIntervalOutNodes', () => {
    it('puts IntervalOut nodes into all OUT_SLOTS that are not connected yet', () => {
      /* fct has two out slots, of which one is already connected,
       * fct2 has one out slot, that is still free */
      const fctSlot1 = SlotSeeder.generateIntegerInSlot({ name: 'A' })
      const fctSlot2 = SlotSeeder.generateIntegerOutSlot({ name: 'B' })
      const fctSlot3 = SlotSeeder.generateIntegerOutSlot({ name: 'C' })

      const fct2Slot = SlotSeeder.generateIntegerOutSlot()

      const pushInSlot = SlotSeeder.generateAnyOutSlot()
      const intervalOutSlot = SlotSeeder.generateAnyInSlot()

      const fct = FunctionalitySeeder.generate({ slots: [ fctSlot1, fctSlot2, fctSlot3 ] })
      const fct2 = FunctionalitySeeder.generate({ slots: [ fct2Slot ] })
      const pushIn = FunctionalitySeeder.generatePushIn({ slots: [ pushInSlot ] })
      const intervalOut = FunctionalitySeeder.generateIntervalOut({ slots: [ intervalOutSlot ] })

      const graph = FCTGraphSeeder.generate({ functionalities: [ fct, fct2, pushIn, intervalOut ] })
      const graphWithOneConnection = FCTGraph
        .connect(graph, fct.id, fctSlot1.name, pushIn.id, pushInSlot.name)

      const fullyConnectedGraph = FCTGraph.connect(
        graphWithOneConnection, fct.id, fctSlot2.name, intervalOut.id, intervalOutSlot.name)

      const res = FCTGraph.populateIntervalOutNodes(fullyConnectedGraph)

      expect(res.functionalities
        .filter(aFct => !Functionality.isOutputNode(aFct) && !Functionality.isInputNode(aFct))
        .every(aFct => aFct.slots
          .filter(slot => slot.type === Slot.TYPES.OUT_SLOT)
          .every(slot => FCTGraph.slotIsConnectedToOutputNode(res, aFct.id, slot.name))))
        .toBe(true)

      expect(res.functionalities
        .filter(aFct => Functionality.isOutputNode(aFct))
          .every(aFct => aFct.publishIntervalMs === 1000)).toBe(true)
    })
  })

  describe('fctsDeepEquals', () => {
    describe('when the graphs have the same fcts', () => {
      it('returns true', () => {
        const slot1 = SlotSeeder.generateIntegerInSlot({ name: 'A' })
        const slot2 = SlotSeeder.generateIntegerOutSlot({ name: 'B' })
        const slot3 = SlotSeeder.generateIntegerOutSlot()
        const slot4 = SlotSeeder.generateIntegerInSlot()

        const fct1 = FunctionalitySeeder.generate({ slots: [ slot1, slot2 ] })
        const fct2 = FunctionalitySeeder.generate({ slots: [ slot3 ] })
        const fct3 = FunctionalitySeeder.generate({ slots: [ slot4 ] })

        const g1 = FCTGraphSeeder.generate({ functionalities: [ fct1, fct2, fct3 ] })
        const g2 = FCTGraphSeeder.generate({ functionalities: [ fct1, fct2, fct3 ] })

        const res = FCTGraph.fctsDeepEquals(g1, g2)

        expect(res).toBe(true)
      })
    })

    describe('when the graphs do NOT have the same fcts', () => {
      it('returns false', () => {
        const slot1 = SlotSeeder.generateIntegerInSlot({ name: 'A' })
        const slot2 = SlotSeeder.generateIntegerOutSlot({ name: 'B' })
        const slot3 = SlotSeeder.generateIntegerOutSlot()
        const slot4 = SlotSeeder.generateIntegerInSlot()

        const fct1 = FunctionalitySeeder.generate({ slots: [ slot1, slot2 ] })
        const fct2 = FunctionalitySeeder.generate({ slots: [ slot3 ] })
        const fct3 = FunctionalitySeeder.generate({ slots: [ slot4 ] })

        const g1 = FCTGraphSeeder.generate({ functionalities: [ fct1, fct2, fct3 ] })
        const g2 = FCTGraphSeeder.generate({ functionalities: [ fct2, fct3 ] })

        const res = FCTGraph.fctsDeepEquals(g1, g2)

        expect(res).toBe(false)
      })
    })
  })

  describe('removeFunctionality', () => {
    it('removes the fct and all connections to it from other fcts', () => {
      const slot1 = SlotSeeder.generateIntegerInSlot({ name: 'A', unit: '-' })
      const slot2 = SlotSeeder.generateIntegerInSlot({ name: 'B', unit: '-' })
      const slot3 = SlotSeeder.generateIntegerOutSlot({ name: 'C', unit: '-' })
      const fctToBeDeleted = FunctionalitySeeder.generate({ slots: [ slot1, slot2, slot3 ] })

      const slot4 = SlotSeeder.generateIntegerOutSlot({ name: 'A', unit: '-' })
      const slot5 = SlotSeeder.generateIntegerInSlot({ name: 'B', unit: '-' })

      const fctToStay1 = FunctionalitySeeder.generate({ slots: [ slot4, slot5 ] })

      const slot6 = SlotSeeder.generateIntegerOutSlot({ name: 'A', unit: '-' })
      const slot7 = SlotSeeder.generateIntegerInSlot({ name: 'B', unit: '-' })
      const fctToStay2 = FunctionalitySeeder.generate({ slots: [ slot6, slot7 ] })

      const slot8 = SlotSeeder.generateIntegerOutSlot({ unit: '-' })
      const fctToStay3 = FunctionalitySeeder.generate({ slots: [ slot8 ] })

      const initGraph = FCTGraphSeeder
        .generate({ functionalities: [
          fctToBeDeleted,
          fctToStay1,
          fctToStay2,
          fctToStay3,
        ] })

      const connections = [
        [ fctToBeDeleted.id, slot3.name, fctToStay1.id, slot5.name ],
        [ fctToBeDeleted.id, slot1.name, fctToStay1.id, slot4.name ],
        [ fctToBeDeleted.id, slot2.name, fctToStay2.id, slot6.name ],
        [ fctToStay2.id, slot7.name, fctToStay3.id, slot8.name ],
      ]

      const connectedGraph = connections.reduce((currGraph, con) => (
        FCTGraph.connect(currGraph, ...con)
      ), initGraph)

      const resGraph = FCTGraph
        .removeFunctionality(connectedGraph, fctToBeDeleted.id)

      expect(resGraph.functionalities).toHaveLength(3)

      expect(resGraph.functionalities[0].slots.every(slot => slot.dataStreams.length === 0))
        .toBe(true)

      expect(resGraph.functionalities[0].slots[0].dataStreams).toHaveLength(0)
      expect(resGraph.functionalities[0].slots[1].dataStreams).toHaveLength(0)
      expect(resGraph.functionalities[1].slots[0].dataStreams).toHaveLength(0)
      expect(resGraph.functionalities[1].slots[1].dataStreams).toHaveLength(1)
      expect(resGraph.functionalities[2].slots[0].dataStreams).toHaveLength(1)
    })
  })

  describe('removeIntervalOutNode', () => {
    it('removes the fct and all connections to it from other fcts', () => {
      const slot1 = SlotSeeder.generateIntegerInSlot({ name: 'B', unit: '-' })
      const fctToBeDeleted = FunctionalitySeeder.generateIntervalOut({ slots: [ slot1 ] })

      const slot2 = SlotSeeder.generateIntegerOutSlot({ name: 'A', unit: '-' })
      const fctToStay = FunctionalitySeeder.generate({ slots: [ slot2 ] })

      const initGraph = FCTGraphSeeder
        .generate({ functionalities: [
          fctToBeDeleted,
          fctToStay,
        ] })

      const connections = [
        [ fctToBeDeleted.id, slot1.name, fctToStay.id, slot2.name ],
      ]

      const connectedGraph = connections.reduce((currGraph, con) => (
        FCTGraph.connect(currGraph, ...con)
      ), initGraph)

      const resGraph = FCTGraph
        .removeIntervalOutNode(connectedGraph, fctToStay.id, slot2.name)

      expect(resGraph.functionalities).toHaveLength(1)
      expect(resGraph.functionalities[0].id).toBe(fctToStay.id)
      expect(resGraph.functionalities[0].slots.every(slot => slot.dataStreams.length === 0))
        .toBe(true)
    })
  })

  describe('removePushInNode', () => {
    it('removes the fct and all connections to it from other fcts', () => {
      const slot1 = SlotSeeder.generateIntegerOutSlot({ name: 'B', unit: '-' })
      const fctToBeDeleted = FunctionalitySeeder.generatePushIn({ slots: [ slot1 ] })

      const slot2 = SlotSeeder.generateIntegerInSlot({ name: 'A', unit: '-' })
      const fctToStay = FunctionalitySeeder.generate({ slots: [ slot2 ] })

      const initGraph = FCTGraphSeeder
        .generate({ functionalities: [
          fctToBeDeleted,
          fctToStay,
        ] })

      const connections = [
        [ fctToBeDeleted.id, slot1.name, fctToStay.id, slot2.name ],
      ]

      const connectedGraph = connections.reduce((currGraph, con) => (
        FCTGraph.connect(currGraph, ...con)
      ), initGraph)

      const resGraph = FCTGraph
        .removePushInNode(connectedGraph, fctToStay.id, slot2.name)

      expect(resGraph.functionalities).toHaveLength(1)
      expect(resGraph.functionalities[0].id).toBe(fctToStay.id)
      expect(resGraph.functionalities[0].slots.every(slot => slot.dataStreams.length === 0))
        .toBe(true)
    })
  })
})
