const { PIDControllerSeeder } = require('seeders/functionalities')
const InSlot = require('slots/InSlot')
const OutSlot = require('slots/OutSlot')

describe('Functionality', () => {
  describe('getInSlots', () => {
    it('returns the InSlots of a functionality', () => {
      const fct = PIDControllerSeeder.seedOne()
      const expectedResult = fct.slots.filter(({ type }) => type === InSlot.TYPE)

      const slots = fct.getInSlots()

      expect(slots).toStrictEqual(expectedResult)
    })
  })

  describe('getOutSlots', () => {
    it('returns the OutSlots of a functionality', () => {
      const fct = PIDControllerSeeder.seedOne()
      const expectedResult = fct.slots.filter(({ type }) => type === OutSlot.TYPE)

      const slots = fct.getOutSlots()

      expect(slots).toStrictEqual(expectedResult)
    })
  })

  describe('getSlotByName', () => {
    it('returns a slot by name', () => {
      const fct = PIDControllerSeeder.seedOne()
      const slotName = fct.slots[0].name

      const slot = fct.getSlotByName(slotName)

      expect(slot).toBe(fct.slots[0])
    })
  })
})
