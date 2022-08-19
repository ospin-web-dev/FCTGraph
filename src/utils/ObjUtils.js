const diff = require('deep-diff')
/* eslint-disable no-return-assign */
/* eslint-disable no-sequences */
/* eslint-disable no-param-reassign */

const objsDeepDiff = (objA, objB) => diff(objA, objB) // library returns undefined for no diffs

const objsDeepEqual = (objA, objB) => {
  const objDiff = objsDeepDiff(objA, objB)
  return typeof objDiff === 'undefined'
}

module.exports = {
  objsDeepDiff,
  objsDeepEqual,
}
