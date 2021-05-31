const FCTGraph = require('FCTGraph')

const validSlotData = require('./seeds/slots/valid.js')
const { SlotSeeder } = require('./seeders')

describe('FCTGraph', () => {

  describe('new', () => {
    it('throws if given an invalid data object', () => {
      expect(new FCTGraph()).toThrowError()
    })
  })

  // will not accept creation if it has funcs which aren't a specific type (no vanilla funcs)
  //
  // will not accept vanilla slots

})
