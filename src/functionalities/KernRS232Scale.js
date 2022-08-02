const JOIous = require('../mixins/instanceMixins/JOIous')
const Sensor = require('./Sensor')

class KernRS232Scale extends Sensor {

  static get SUB_TYPE() {
    return 'KernRS232Scale'
  }

}

module.exports = (
  JOIous(KernRS232Scale)
)
