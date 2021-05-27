const FCTGraph = require('FCTGraph')

const validSlotData = require('./seeds/slots/valid.js')
const { SlotSeeder } = require('./seeders')

describe('FCTGraph', () => {

  describe('new', () => {
    it('throws if given an invalid data object', () => {
      expect(new FCTGraph()).toThrowError()
    })
  })

})
