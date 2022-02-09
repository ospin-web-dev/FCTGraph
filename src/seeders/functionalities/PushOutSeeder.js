const OutputNodeSeeder = require('./OutputNodeSeeder')
const {
  FloatInSlotSeeder,
} = require('../slots')
const PushOut = require('../../functionalities/PushOut')
const Slot = require('../../slots/Slot')

class PushOutSeeder extends OutputNodeSeeder {

  static generateSlots() {
    return [
      FloatInSlotSeeder.generate({
        name: PushOut.SLOT_NAME,
        unit: Slot.ANY_UNIT_STRING,
      }),
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
