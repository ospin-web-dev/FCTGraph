const sortObjectsByKeyValue = (arr, key) => {
  const sortedArray = [...arr].sort((a, b) => (a[key] > b[key] ? 1 : -1))
  return sortedArray
}

module.exports = {
  sortObjectsByKeyValue,
}
