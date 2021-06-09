const Slot = require('slots/Slot')
const { InSlotSeeder } = require('test/seeders/slots')

describe('the Slot class', () => {

  describe('.assertStructure', () => {

    it('blows up because Slot is a virtual class and it wants to kindly tell you that a mistake was likely made in a child that has not defined the method', () => {
      const slot = new Slot(InSlotSeeder.generate())

      expect(() => {
        slot.assertStructure()
      }).toThrow(/requires an \.assertStructure method/)
    })
  })

  describe('.connect', () => {

    it('TODO RETURNS RESULTS SIMILAR TO HOW THE FCTGRAPH DOES WHEN A NODE CAN BE ADDED...when the slot dataTypes are incompatible', () => {
      throw new Error()
    })

    it('TODO RETURNS RESULTS SIMILAR TO HOW THE FCTGRAPH DOES WHEN A NODE CAN BE ADDED...when the slots types are incompatible', () => {
      throw new Error()
    })

    it('TODO RETURNS RESULTS SIMILAR TO HOW THE FCTGRAPH DOES WHEN A NODE CAN BE ADDED...when the slot units are incompatible', () => {
      throw new Error()
    })
  })
})
