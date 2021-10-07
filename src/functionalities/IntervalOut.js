const JOIous = require('../mixins/instanceMixins/JOIous')
const OutputNode = require('./OutputNode')

class IntervalOut extends OutputNode {

  static get SUB_TYPE() {
    return 'IntervalOut'
  }

}

module.exports = (
  JOIous(IntervalOut)
)
