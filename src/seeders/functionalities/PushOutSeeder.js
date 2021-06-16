const OutputNodeSeeder = require('./OutputNodeSeeder')
const { InSlotSeeder } = require('../slots')
const PushOut = require('../../functionalities/PushOut')

class PushOutSeeder extends OutputNodeSeeder {

  static generateSlots() {
    return [
      InSlotSeeder.generateUnitlessIn({ name: 'value in' }),
    ]
  }

  static generate(overrideData = {}) {
    return {
      ...super.generate(overrideData),
      subType: PushOut.SUB_TYPE,
      slots: this.generateSlots(),
      ...overrideData,
    }
  }

}

module.exports = PushOutSeeder
