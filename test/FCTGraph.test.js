const FCTGraph = require('FCTGraph')

describe('the FCTGraph class', () => {

  describe('new', () => {
    it('throws if given an invalid data object', () => {
      expect(() => {
        new FCTGraph({}) // eslint-disable-line
      }).toThrow('is required')
    })
  })
})
