const JOIous = require('../mixins/instanceMixins/JOIous')
const InputNode = require('./InputNode')

class PushIn extends InputNode {

  static get SUB_TYPE() {
    return 'PushIn'
  }

}

module.exports = (
  JOIous(PushIn)
)
