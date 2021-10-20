const FCTGraph = require('../../FCTGraph')

module.exports = fn => (
  (...args) => {
    const firstArg = args[0]
    const firstArgIsFCTGraphInstance = firstArg instanceof FCTGraph

    if (!firstArgIsFCTGraphInstance) {
      throw new Error(`When using ${fn.name}, the first argument must be an instance of fctGraph.\nReceived: ${firstArg}`)
    }

    return fn(...args)
  }
)
