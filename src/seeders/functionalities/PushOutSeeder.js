const OutputNodeSeeder = require('./OutputNodeSeeder')
const {
  FloatInSlotSeeder,
  RandomSlotSeeder,
} = require('../slots')
const PushOut = require('../../functionalities/PushOut')

class PushOutSeeder extends OutputNodeSeeder {

  static generateSlots() {
    return [
      RandomSlotSeeder.generateRandomInSlot({ name: PushOut.SLOT_NAME }),
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

  static generateFloatPushOutCelsius(overrideData) {
    return this.generate({
      slots: [
        FloatInSlotSeeder.generate({ name: 'value in', unit: '°C' }),
      ],
      ...overrideData,
    })
  }

}

module.exports = PushOutSeeder
