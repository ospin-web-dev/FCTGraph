const OutputNodeSeeder = require('./OutputNodeSeeder')
const {
  FloatInSlotSeeder,
  RandomSlotSeeder,
} = require('../slots')
const PushOut = require('../../functionalities/PushOut')

class PushOutSeeder extends OutputNodeSeeder {

  static generateSlots() {
    return [
      RandomSlotSeeder.generateRandomInSlot({ name: 'value in' }),
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

  static generateFloatPushOutCelcius() {
    return this.generate({
      slots: [ FloatInSlotSeeder.generate({ unit: '°C' }) ],
    })
  }

}

module.exports = PushOutSeeder
