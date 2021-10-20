const assertFCTGraphFirstArgument = require('../helpers/assertFCTGraphFirstArgument')

function fctGraphsAreSameWIthoutIONodes(fctGraphA, fctGraphB) {

  assertFCTGraphFirstArgument(() => {})(fctGraphA)
  assertFCTGraphFirstArgument(() => {})(fctGraphB)

  const fctGraphArray = [fctGraphA.clone(), fctGraphB.clone()]

  fctGraphArray.map(fctGraphClone => {
    const ioNodes = fctGraphClone.getIONodeFcts()
    ioNodes.forEach(iONode => {
      fctGraphClone.removeFct(iONode)
    })
    return fctGraphClone
  })

  return fctGraphArray[0].fctsDeepEquals(fctGraphArray[1])
}

module.exports = fctGraphsAreSameWIthoutIONodes
