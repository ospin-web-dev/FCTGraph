const faker = require('faker')
const Functionality = require('../../src/functionalities/Functionality')
const FunctionalitySeeder = require('../../src/seeders/functionalities/FunctionalitySeeder')
const SlotSeeder = require('../../src/seeders/slots/SlotSeeder')
const DataStreamSeeder = require('../../src/seeders/dataStreams/DataStreamSeeder')

describe('Functionality', () => {

  describe('create', () => {

    const generateMinimalDataSet = () => ({
      id: faker.datatype.uuid(),
      name: faker.random.word(),
      type: faker.random.word(),
      subType: faker.random.word(),
    })

    it('sets all default values', () => {
      const res = Functionality.create(generateMinimalDataSet())

      expect(res).toStrictEqual(expect.objectContaining({
        slots: [],
        isVirtual: false,
        ports: [],
      }))
    })

    it('does not set the ports for a virtual functionality', () => {
      const res = Functionality.create({ ...generateMinimalDataSet(), isVirtual: true })

      expect(res).toStrictEqual(expect.not.objectContaining({
        ports: [],
      }))
    })

    it('allows setting optional values', () => {
      const optional = {
        outputIntervalMs: faker.datatype.number({ min: 0 }),
        ports: [
          { name: faker.random.word(), purpose: faker.random.word() },
        ],
      }

      const res = Functionality.create({ ...generateMinimalDataSet(), ...optional })

      expect(res).toStrictEqual(expect.objectContaining(optional))
    })

    describe('when two slots have the same name', () => {
      it('should throw', () => {
        const data = {
          slots: [
            SlotSeeder.generateIntegerInSlot({ name: 'A' }),
            SlotSeeder.generateIntegerInSlot({ name: 'A' }),
          ],
        }

        expect(() => Functionality.create({ ...generateMinimalDataSet(), ...data }))
          .toThrow(/duplicate value/)
      })
    })

    describe('when creating an INTERVAL_OUT node', () => {
      it('allows setting the "publishIntervalMs" property', () => {
        const nodeSpecific = {
          type: Functionality.FIXED_TYPES.OUTPUT_NODE,
          subType: Functionality.FIXED_SUB_TYPES.INTERVAL_OUT,
          publishIntervalMs: faker.datatype.number({ min: 1, max: 1000 * 60 * 60 * 24 }),
        }

        const res = Functionality.create({ ...generateMinimalDataSet(), ...nodeSpecific })

        expect(res).toStrictEqual(expect.objectContaining(nodeSpecific))
      })
    })

    describe('when NOT creating an INTERVAL_OUT node', () => {
      it('throw an error when try to set "publishIntervalMs"', () => {
        const nodeSpecific = {
          publishIntervalMs: faker.datatype.number({ min: 1, max: 1000 * 60 * 60 * 24 }),
        }

        expect(() => Functionality.create({ ...generateMinimalDataSet(), ...nodeSpecific }))
          .toThrow(/publishIntervalMs/)
      })
    })

  })

  describe('update', () => {
    it('updates a functionality', () => {
      const fct = FunctionalitySeeder.generate()
      const update = { slots: [ SlotSeeder.generateIntegerInSlot() ] }

      const updatedFct = Functionality.update(fct, update)

      expect(updatedFct).toStrictEqual(expect.objectContaining(update))
    })
  })

  describe('updateSlotByName', () => {
    it('updates a functionality', () => {
      const slot = SlotSeeder.generateIntegerInSlot()
      const fct = FunctionalitySeeder.generate({ slots: [ slot ] })
      const update = {
        dataStreams: [
          DataStreamSeeder.generate({
            sourceSlotName: slot.name,
            sourceFctId: fct.id,
          }),
        ],
      }

      const updatedFct = Functionality.updateSlotByName(fct, slot.name, update)

      expect(updatedFct.slots[0]).toStrictEqual(expect.objectContaining(update))
    })
  })

  describe('isInputNode', () => {
    describe('when fct is an INPUT_NODE', () => {
      it('should return true', () => {
        const fct = FunctionalitySeeder.generatePushIn()

        const res = Functionality.isInputNode(fct)

        expect(res).toBe(true)
      })
    })

    describe('when fct is NOT an INPUT_NODE', () => {
      it('should return false', () => {
        const fct = FunctionalitySeeder.generate()

        const res = Functionality.isInputNode(fct)

        expect(res).toBe(false)
      })
    })
  })

  describe('isOutputNode', () => {
    describe('when fct is an OUTPUT_NODE', () => {
      it('should return true', () => {
        const fct = FunctionalitySeeder.generateIntervalOut()

        const res = Functionality.isOutputNode(fct)

        expect(res).toBe(true)
      })
    })

    describe('when fct is NOT an OUTPUT_NODE', () => {
      it('should return false', () => {
        const fct = FunctionalitySeeder.generate()

        const res = Functionality.isOutputNode(fct)

        expect(res).toBe(false)
      })
    })
  })

  describe('isPhysical', () => {
    describe('when fct is NOT virtual', () => {
      it('should return true', () => {
        const fct = FunctionalitySeeder.generate({ isVirtual: false })

        const res = Functionality.isPhysical(fct)

        expect(res).toBe(true)
      })
    })

    describe('when fct is virtual', () => {
      it('should return false', () => {
        const fct = FunctionalitySeeder.generate({ isVirtual: true })

        const res = Functionality.isPhysical(fct)

        expect(res).toBe(false)
      })
    })
  })

  describe('getSlotNames', () => {
    it('should return all slot names of functionality', () => {
      const slotA = SlotSeeder.generateIntegerInSlot({ name: 'slotA' })
      const slotB = SlotSeeder.generateIntegerOutSlot({ name: 'slotB' })
      const fct = FunctionalitySeeder.generate({ slots: [slotA, slotB] })

      const res = Functionality.getSlotNames(fct)

      expect(res).toStrictEqual(expect.arrayContaining([slotA.name, slotB.name]))
    })
  })

  describe('getInSlots', () => {
    it('should return all IN slots of functionality', () => {
      const slotA = SlotSeeder.generateIntegerInSlot({ name: 'slotA' })
      const slotB = SlotSeeder.generateIntegerInSlot({ name: 'slotB' })
      const slotC = SlotSeeder.generateIntegerOutSlot({ name: 'slotC' })
      const fct = FunctionalitySeeder.generate({ slots: [slotA, slotB, slotC] })

      const res = Functionality.getInSlots(fct)

      expect(res).toStrictEqual(expect.arrayContaining([slotA, slotB]))
    })
  })

  describe('getOutSlots', () => {
    it('should return all OUT slots of functionality', () => {
      const slotA = SlotSeeder.generateIntegerInSlot({ name: 'slotA' })
      const slotB = SlotSeeder.generateIntegerOutSlot({ name: 'slotB' })
      const slotC = SlotSeeder.generateIntegerOutSlot({ name: 'slotC' })
      const fct = FunctionalitySeeder.generate({ slots: [slotA, slotB, slotC] })

      const res = Functionality.getOutSlots(fct)

      expect(res).toStrictEqual(expect.arrayContaining([slotB, slotC]))
    })
  })

  describe('getSlotByName', () => {
    it('should return the desired slot', () => {
      const slotA = SlotSeeder.generateIntegerInSlot({ name: 'slotA' })
      const slotB = SlotSeeder.generateIntegerOutSlot({ name: 'slotB' })
      const fct = FunctionalitySeeder.generate({ slots: [slotA, slotB] })

      const res = Functionality.getSlotByName(fct, slotA.name)

      expect(res).toStrictEqual(slotA)
    })
  })

  describe('when working with connected fcts', () => {

    const creatDefaultSetup = () => {
      const fctId = faker.datatype.uuid()
      const ds1 = DataStreamSeeder.generate({ sinkSlotName: 'slotA', sinkFctId: fctId })
      const ds2 = DataStreamSeeder.generate({ sourceSlotName: 'slotB', sourceFctId: fctId })
      const slotA = SlotSeeder
        .generateIntegerInSlot({ name: ds1.sinkSlotName, dataStreams: [ds1] })
      const slotB = SlotSeeder
        .generateIntegerOutSlot({ name: ds2.sourceSlotName, dataStreams: [ds2] })
      const fct = FunctionalitySeeder.generate({ id: fctId, slots: [slotA, slotB] })

      return { fct, ds1, ds2, slotA, slotB }
    }

    describe('getAllDataStreams', () => {
      it('should return all datastreams of all slots as flat array', () => {
        const { ds1, ds2, fct } = creatDefaultSetup()

        const res = Functionality.getAllDataStreams(fct)

        expect(res).toStrictEqual(expect.arrayContaining([ds1, ds2]))
      })
    })

    describe('getDataStreamsCount', () => {
      it('should return the number of datastreams from all slots of the fct', () => {
        const { fct } = creatDefaultSetup()

        const res = Functionality.getDataStreamsCount(fct)

        expect(res).toBe(2)
      })
    })

    describe('getConnectedFctIds', () => {
      it('should return the ids of all connected fcts', () => {
        const { fct, ds1, ds2 } = creatDefaultSetup()

        const res = Functionality.getConnectedFctIds(fct)

        expect(res).toStrictEqual(expect.arrayContaining([
          ds1.sourceFctId,
          ds2.sinkFctId,
        ]))
      })
    })

    describe('getConnectedSourceFctIds', () => {
      it('should return the ids of all fcts that have a data stream TO the given fct', () => {
        const { fct, ds1 } = creatDefaultSetup()

        const res = Functionality.getConnectedSourceFctIds(fct)

        expect(res).toHaveLength(1)
        expect(res).toStrictEqual(expect.arrayContaining([ ds1.sourceFctId ]))
      })
    })

    describe('getConnectedSinkFctIds', () => {
      it('should return the ids of all fcts that have a data stream FROM the given fct', () => {
        const { fct, ds2 } = creatDefaultSetup()

        const res = Functionality.getConnectedSinkFctIds(fct)

        expect(res).toHaveLength(1)
        expect(res).toStrictEqual(expect.arrayContaining([ ds2.sinkFctId ]))
      })
    })

    describe('isConnectedToFct', () => {
      describe('when the fcts are connected', () => {
        it('should return true', () => {
          const { fct, ds2 } = creatDefaultSetup()

          const res = Functionality.isConnectedToFct(fct, ds2.sinkFctId)

          expect(res).toBe(true)
        })
      })

      describe('when the fcts are NOT connected', () => {
        it('should return false', () => {
          const { fct } = creatDefaultSetup()

          const res = Functionality.isConnectedToFct(fct, faker.datatype.uuid)

          expect(res).toBe(false)
        })
      })
    })

    describe('connectsToFctSlot', () => {
      describe('when the fct is connected to the specific slot', () => {
        it('should return true', () => {
          const { fct, ds2 } = creatDefaultSetup()

          const res = Functionality.connectsToFctSlot(fct, ds2.sinkFctId, ds2.sinkSlotName)

          expect(res).toBe(true)
        })
      })

      describe('when the fct is NOT connected to the specific slot', () => {
        it('should return false', () => {
          const { fct, ds2 } = creatDefaultSetup()

          const res = Functionality.connectsToFctSlot(fct, ds2.sinkFctId, 'some other slot')

          expect(res).toBe(false)
        })
      })
    })

    describe('isConnected', () => {
      describe('when the fct is connected', () => {
        it('should return true', () => {
          const { fct } = creatDefaultSetup()

          const res = Functionality.isConnected(fct)

          expect(res).toBe(true)
        })
      })

      describe('when the fct is NOT connected', () => {
        it('should return false', () => {
          const fct = FunctionalitySeeder.generate()

          const res = Functionality.isConnected(fct)

          expect(res).toBe(false)
        })
      })
    })
  })

  describe('isDeepEqual', () => {
    describe('when the fcts are completely equal', () => {
      it('should return true', () => {
        const ds = DataStreamSeeder.generate()
        const slot = SlotSeeder
          .generateIntegerInSlot({ name: ds.sinkSlotName, dataStreams: [ ds ] })
        const fct = FunctionalitySeeder.generate({ id: ds.sinkFctId, slots: [ slot ] })

        const res = Functionality.isDeepEqual(fct, fct)

        expect(res).toBe(true)
      })
    })

    describe('when the fcts are NOT completely equal', () => {
      it('should return false', () => {
        const ds = DataStreamSeeder.generate()
        const slot = SlotSeeder
          .generateIntegerInSlot({ name: ds.sinkSlotName, dataStreams: [ ds ] })
        const fct1 = FunctionalitySeeder.generate({ id: ds.sinkFctId, slots: [ slot ] })
        const fct2 = FunctionalitySeeder.generate()

        const res = Functionality.isDeepEqual(fct1, fct2)

        expect(res).toBe(false)
      })
    })
  })

  describe('OUTPUT_NODE_SLOT_NAME', () => {
    it('returns the default slot name for OUTPUT_NODE', () => {
      expect(Functionality.OUTPUT_NODE_SLOT_NAME).toBe('input')
    })
  })

  describe('INPUT_NODE_SLOT_NAME', () => {
    it('returns the default slot name for INPUT_NODE', () => {
      expect(Functionality.INPUT_NODE_SLOT_NAME).toBe('output')
    })
  })
})
