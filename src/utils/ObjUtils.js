const diff = require('deep-diff')
/* eslint-disable no-return-assign */
/* eslint-disable no-sequences */
/* eslint-disable no-param-reassign */

// eat your heart out scheme

const sortByKeys = o => {
  if (Array.isArray(o)) {
    return o.map(sortByKeys)
  }

  return typeof o === 'object'
    ? Object.keys(o).sort().reduce((r, k) => (
      r[k] = sortByKeys(o[k]), r
    ), {})
    : o
}

const objsDeepDiff = (objA, objB) => diff(objA, objB) // library returns undefined for no diffs

const objsDeepEqual = (objA, objB) => {
  const objDiff = objsDeepDiff(objA, objB)
  return typeof objDiff === 'undefined'
}

// removes props (keys)
const exclude = (obj, keys) => {
  const newObj = { ...obj }

  keys.forEach(key => {
    delete newObj[key]
  })

  return newObj
}

module.exports = {
  sortByKeys,
  objsDeepDiff,
  objsDeepEqual,
  exclude,
}
