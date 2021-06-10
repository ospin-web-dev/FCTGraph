const JOIous = require('mixins/instanceMixins/JOIous')

describe('the JOIous mixin', () => {

  describe('.serialize', () => {
    it('blows up because JOIous should only be composed in to classes which implement a .serilize method', () => {
      const Abomination = JOIous(class X {})

      expect(() => {
        // eslint-disable-next-line
        new Abomination() // JOI constructor calls .serialize
      }).toThrow(/X requires a .serialize method/)
    })
  })
})
