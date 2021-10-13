const fctGraphUtils = require('fctGraph/Utils')

function getExportedFunctions(module) {
  return Object.values(module)
    .reduce((fns, exported) => {
      if (typeof exported === 'function') {
        fns.push(exported)
      } else if (typeof exported === 'object') {
        // eslint-disable-next-line
        fns = fns.concat(getExportedFunctions(exported))
      }

      return fns
    }, [])
}

describe('the FCTGraph utils module', () => {

  it('has every function it exports throw error if the first argument is not an instance of an fctGraph', () => {
    const exportedFunctions = getExportedFunctions(fctGraphUtils)

    exportedFunctions.forEach(fn => {
      expect(() => fn(1))
        .toThrow(/the first argument must be an instance of fctGraph/)
    })
  })
})
