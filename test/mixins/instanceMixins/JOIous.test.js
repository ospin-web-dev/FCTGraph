// eslint-disable-next-line
const JOIous = require('mixins/instanceMixins/JOIous')

describe('the JOIous mixin', () => {

  describe('.serialize', () => {
    it('blows up because JOIous should only be composed in to classes which implement a .serialize method', () => {
      const Abomination = JOIous(class X {})

      expect(() => {
        const abom = new Abomination()
        abom.serialize()
      }).toThrow(/X requires a .serialize method/)
    })
  })

  describe('.newAndAssertStructure', () => {
    it('blows up because JOIous should only be composed in to classes which implement a .serialize method', () => {
      const Abomination = JOIous(class X {})

      expect(() => {
        Abomination.newAndAssertStructure()
      }).toThrow(/X requires a .serialize method/)
    })
  })
})
