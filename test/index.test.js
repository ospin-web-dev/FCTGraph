const index = require('../index')

describe('index (entry point)', () => {

  it('exports FCTGraph', () => {
    expect(index.FCTGraph).not.toBeNull()
  })

})
