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

module.exports = { sortByKeys }
