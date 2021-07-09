const OutputNodeSeeder = require('./OutputNodeSeeder')
const { FloatInSlotSeeder } = require('../slots')
const IntervalOut = require('../../functionalities/IntervalOut')

class IntervalOutSeeder extends OutputNodeSeeder {

  static generateSlots() {
    return [
      FloatInSlotSeeder.generate({ name: 'value in' }),
    ]
  }

  static generate(overrideData = {}) {
    return {
      ...super.generate(overrideData),
      subType: IntervalOut.SUB_TYPE,
      slots: this.generateSlots(),
      ...overrideData,
    }
  }

}

module.exports = IntervalOutSeeder
