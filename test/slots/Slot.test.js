const faker = require('faker')

const Slot = require('../../src/slots/Slot')
const DataStreamSeeder = require('../../src/seeders/dataStreams/DataStreamSeeder')
const SlotSeeder = require('../../src/seeders/slots/SlotSeeder')

describe('Slot', () => {

  describe('create', () => {
    describe('when creating an "integer" slot', () => {

      const generateDefaultData = (data = {}) => ({
        name: faker.random.word(),
        type: Slot.TYPES.IN_SLOT,
        dataType: Slot.DATA_TYPES.INTEGER,
        unit: '-',
        defaultValue: 100,
        min: 0,
        max: 200,
        ...data,
      })

      it('sets all default properties', () => {
        const data = generateDefaultData()

        const slot = Slot.create(data)

        expect(slot.dataStreams).toStrictEqual([])
        expect(slot.displayType).toBeNull()
      })

      it('throws when defaultValue above max', () => {
        const data = generateDefaultData({ defaultValue: 300 })

        expect(() => Slot.create(data)).toThrow(/"defaultValue" must be less than or equal to ref:max/)
      })

      it('throws when defaultValue is below min', () => {
        const data = generateDefaultData({ defaultValue: -100 })

        expect(() => Slot.create(data)).toThrow(/"defaultValue" must be greater than or equal to ref:min/)
      })

      it('throws when max is below min', () => {
        const data = generateDefaultData({ max: -100, defaultValue: null })

        expect(() => Slot.create(data)).toThrow(/"max" must be greater than or equal to ref:min/)
      })

      describe.each([
        { prop: 'selectOptions', value: ['test'] },
      ])('when $prop is provided', ({ prop, value }) => {
        it('throws an error', () => {
          const data = generateDefaultData({ [prop]: value })

          expect(() => Slot.create(data)).toThrow(`${prop}`)
        })
      })
    })

    describe('when creating a "float" slot', () => {

      const generateDefaultData = (data = {}) => ({
        name: faker.random.word(),
        type: Slot.TYPES.IN_SLOT,
        dataType: Slot.DATA_TYPES.FLOAT,
        unit: '-',
        defaultValue: 100.1,
        min: 0.2,
        max: 200.1,
        ...data,
      })

      it('sets all default properties', () => {
        const data = generateDefaultData()

        const slot = Slot.create(data)

        expect(slot.dataStreams).toStrictEqual([])
        expect(slot.displayType).toBeNull()
      })

      it('throws when defaultValue is above max', () => {
        const data = generateDefaultData({ defaultValue: 300.1 })

        expect(() => Slot.create(data)).toThrow(/"defaultValue" must be less than or equal to ref:max/)
      })

      it('throws when defaultValue is below min', () => {
        const data = generateDefaultData({ defaultValue: -100.1 })

        expect(() => Slot.create(data)).toThrow(/"defaultValue" must be greater than or equal to ref:min/)
      })

      it('throws when max is below min', () => {
        const data = generateDefaultData({ max: -100.1, defaultValue: null })

        expect(() => Slot.create(data)).toThrow(/"max" must be greater than or equal to ref:min/)
      })

      describe.each([
        { prop: 'selectOptions', value: ['test'] },
      ])('when $prop is provided', ({ prop, value }) => {
        it('throws an error', () => {
          const data = generateDefaultData({ [prop]: value })

          expect(() => Slot.create(data)).toThrow(`${prop}`)
        })
      })
    })

    describe('when creating a "boolean" slot', () => {

      const generateDefaultData = (data = {}) => ({
        name: faker.random.word(),
        type: Slot.TYPES.IN_SLOT,
        dataType: Slot.DATA_TYPES.BOOLEAN,
        unit: '-',
        defaultValue: true,
        ...data,
      })

      it('sets all default properties', () => {
        const data = generateDefaultData()

        const slot = Slot.create(data)

        expect(slot.dataStreams).toStrictEqual([])
        expect(slot.displayType).toBeNull()
      })

      describe.each([
        { prop: 'min', value: 0 },
        { prop: 'max', value: 100 },
        { prop: 'tareable', value: true },
        { prop: 'selectOptions', value: ['test'] },
      ])('when $prop is provided', ({ prop, value }) => {
        it('throws an error', () => {
          const data = generateDefaultData({ [prop]: value })

          expect(() => Slot.create(data)).toThrow(`${prop}`)
        })
      })
    })

    describe('when creating an "oneOf" slot', () => {

      const generateDefaultData = (data = {}) => ({
        name: faker.random.word(),
        type: Slot.TYPES.IN_SLOT,
        dataType: Slot.DATA_TYPES.ONE_OF,
        unit: '-',
        selectOptions: ['A', 'B'],
        defaultValue: 'A',
        ...data,
      })

      it('sets all default properties', () => {
        const data = generateDefaultData()

        const slot = Slot.create(data)

        expect(slot.dataStreams).toStrictEqual([])
        expect(slot.displayType).toBeNull()
      })

      it('throws when defaultValue is not in selectOptions', () => {
        const data = generateDefaultData({ defaultValue: 'C' })

        expect(() => Slot.create(data)).toThrow(/"defaultValue" must be one of/)
      })

      describe.each([
        { prop: 'min', value: 0 },
        { prop: 'max', value: 100 },
        { prop: 'tareable', value: true },
      ])('when $prop is provided', ({ prop, value }) => {
        it('throws an error', () => {
          const data = generateDefaultData({ [prop]: value })

          expect(() => Slot.create(data)).toThrow(`${prop}`)
        })
      })
    })

    describe.each([Slot.DATA_TYPES.ANY, Slot.DATA_TYPES.NUMBER])(
      'when creating a %p slot',
      (type) => {
        const generateDefaultData = (data = {}) => ({
          name: faker.random.word(),
          type: Slot.TYPES.IN_SLOT,
          dataType: type,
          unit: '-',
          ...data,
        })

        it('sets all default properties', () => {
          const data = generateDefaultData()

          const slot = Slot.create(data)

          expect(slot.dataStreams).toStrictEqual([])
          expect(slot.displayType).toBeNull()
      })

      describe.each([
        //{ prop: 'min', value: 0 }, // removal has to be coordinated with firmware
        //{ prop: 'max', value: 100 },
        { prop: 'tareable', value: true },
        { prop: 'selectOptions', value: ['test'] },
      ])('when $prop is provided', ({ prop, value }) => {
        it('throws an error', () => {
          const data = generateDefaultData({ [prop]: value })
          expect(() => Slot.create(data)).toThrow(`${prop}`)
        })
      })

      describe('when a defaultValue is set, but no min/max', () => {
        it('does not fail on validation', () => {
          const data = generateDefaultData({ defaultValue: 0 })

          expect(() => Slot.create(data)).not.toThrow()
        })
      })
      }
    )
  })

  describe('isEmpty', () => {
    describe('when the slot has no dataStreams', () => {
      it('returns true', () => {
        const slot = SlotSeeder.generateIntegerInSlot()

        const res = Slot.isEmpty(slot)

        expect(res).toBe(true)
      })
    })

    describe('when the slot has dataStreams', () => {
      it('returns false', () => {
        const slot = SlotSeeder
          .generateIntegerInSlot({ dataStreams: [ DataStreamSeeder.generate() ] })

        const res = Slot.isEmpty(slot)

        expect(res).toBe(false)
      })
    })
  })

  describe('isUnitless', () => {
    describe('when the slot has the "-" as a unit', () => {
      it('returns true', () => {
        const slot = SlotSeeder.generateIntegerInSlot({ unit: '-' })

        const res = Slot.isUnitless(slot)

        expect(res).toBe(true)
      })
    })

    describe('when the slot has a unit different from "-"', () => {
      it('returns false', () => {
        const slot = SlotSeeder.generateIntegerInSlot({ unit: 'rpm' })

        const res = Slot.isUnitless(slot)

        expect(res).toBe(false)
      })
    })
  })

  describe('isControllerParameter', () => {
    describe('when the slot has the "controller parameter" displayType', () => {
      it('returns true', () => {
        const slot = SlotSeeder.generateIntegerInSlot({ displayType: 'controller parameter' })

        const res = Slot.isControllerParameter(slot)

        expect(res).toBe(true)
      })
    })

    describe('when the slot has displayType different from "controller parameter"', () => {
      it('returns false', () => {
        const slot = SlotSeeder.generateIntegerInSlot({ displayType: 'something' })

        const res = Slot.isControllerParameter(slot)

        expect(res).toBe(false)
      })
    })
  })

  describe('getDisplayName', () => {
    describe('when the slot has no display name set or the display name is null', () => {
      it('should return the slot name', () => {
        const slot1 = SlotSeeder.generateIntegerInSlot()
        const slot2 = SlotSeeder.generateIntegerInSlot({ displayName: null })

        expect(slot1.displayName).toBeUndefined()
        expect(slot2.displayName).toBeNull()

        expect(Slot.getDisplayName(slot1)).toBe(slot1.name)
        expect(Slot.getDisplayName(slot2)).toBe(slot2.name)
      })
    })

    describe('when there is a displayName set', () => {
      it('should return the display name', () => {
        const slot = SlotSeeder.generateIntegerInSlot({ displayName: 'Dieter' })
        expect(Slot.getDisplayName(slot)).toBe(slot.displayName)
      })
    })
  })

  describe('connectsToFctSlot', () => {
    describe('when the slot has a dataStream going to the given fctId + slotName', () => {
      it('returns true', () => {
        const ds = DataStreamSeeder.generate()
        const slot = SlotSeeder
          .generateIntegerInSlot({ name: ds.sourceSlotName, dataStreams: [ ds ] })

        const res = Slot.connectsToFctSlot(slot, ds.sinkFctId, ds.sinkSlotName)

        expect(res).toBe(true)
      })
    })

    describe('when the slot has no dataStream going to the given fctId + slotName', () => {
      it('returns false', () => {
        const slot = SlotSeeder.generateIntegerInSlot()

        const res = Slot.connectsToFctSlot(slot, faker.datatype.uuid(), faker.random.word())

        expect(res).toBe(false)
      })
    })
  })
})
