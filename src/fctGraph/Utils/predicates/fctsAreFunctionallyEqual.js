const ArrayUtils = require('@choux/array-utils')

function fctsAreFunctionallyEqual(fctArrA, fctArrB) {
  if (fctArrA.length !== fctArrB.length) return false

  const sortedA = ArrayUtils.sortObjectsByKeyValue(fctArrA, 'subType')
  const sortedB = ArrayUtils.sortObjectsByKeyValue(fctArrB, 'subType')

  return sortedA.every((fctA, idx) => {
    const fctB = sortedB[idx]

    return fctA.isFunctionallyEqualTo(fctB)
  })
}

module.exports = fctsAreFunctionallyEqual
