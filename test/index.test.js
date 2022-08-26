const fctGraph = require('../index') // eslint-disable-line

describe('fctGraph module entry point', () => {

  const EXPORTED_NAMESPACES = [
    'FCTGraph',
    'Functionality',
    'Slot',
    'DataStream',
    'FCTGraphSeeder',
    'FunctionalitySeeder',
    'SlotSeeder',
    'DataStreamSeeder',
  ]

  it('exports the expected namespaces', () => {
    expect(Object.keys(fctGraph))
      .toHaveLength(EXPORTED_NAMESPACES.length)

    expect(EXPORTED_NAMESPACES.every(ns => ns in fctGraph)).toBe(true)
  })

})
