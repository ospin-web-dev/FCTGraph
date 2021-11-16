const Joi = require('joi')

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

  describe('.serializeAndAssert', () => {
    describe('when it does not explode', () => {
      it('returns the result of serialize', () => {
        const SERIALIZE_RESULT = 1
        const Abomination = JOIous(class X {

          serialize() { return SERIALIZE_RESULT } // eslint-disable-line

        })

        Abomination.assertValidData = () => true

        const abom = new Abomination()
        expect(abom.serializeAndAssert()).toStrictEqual(SERIALIZE_RESULT)
      })
    })
  })

  describe('.sortAndSerializeAndAssert', () => {
    describe('when it does not explode', () => {
      it('returns the sorted result of serialize', () => {
        const Abomination = JOIous(class X {

          serialize() { return { b: 5, a: 5 } } // eslint-disable-line

        })

        Abomination.assertValidData = () => true

        const abom = new Abomination()
        expect(abom.sortAndSerializeAndAssert()).toStrictEqual({
          a: 5,
          b: 5,
        })
      })
    })
  })

  describe('.assertValidDataAndNew', () => {
    it('blows up because JOIous should only be composed in to classes which implement a .SCHEMA method', () => {
      const Abomination = JOIous(class X {})

      expect(() => {
        Abomination.assertValidDataAndNew()
      }).toThrow(/X requires a static .SCHEMA method/)
    })

    it('returns an enriched joi validation error', () => {
      const Abomination = JOIous(class X {})
      Abomination.SCHEMA = Joi.object({
        id: Joi.string().required(),
      })

      expect(() => {
        Abomination.assertValidDataAndNew({})
      }).toThrow(/JOI error in/)
    })

    it('propagates the error when unrelated joi', () => {
      const Abomination = JOIous(class X {})
      Abomination.SCHEMA = Joi.object({
        id: Joi.string().required(),
      })

      const NON_JOI_ERROR = 'u no it m8'
      jest.spyOn(Joi, 'attempt').mockImplementation(() => {
        throw new Error(NON_JOI_ERROR)
      })

      expect(() => {
        Abomination.assertValidDataAndNew({})
      }).toThrow(NON_JOI_ERROR)
    })
  })
})
