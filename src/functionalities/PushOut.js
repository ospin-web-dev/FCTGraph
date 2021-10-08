const JOIous = require('../mixins/instanceMixins/JOIous')
const OutputNode = require('./OutputNode')

class PushOut extends OutputNode {

  static get SUB_TYPE() {
    return 'PushOut'
  }

}

module.exports = (
  JOIous(PushOut)
)
