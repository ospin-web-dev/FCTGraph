const InputNodeSeeder = require('./InputNodeSeeder')
const {
  IntegerOutSlotSeeder,
  FloatOutSlotSeeder,
} = require('../slots')
const PushIn = require('../../functionalities/PushIn')
const Slot = require('../../slots/Slot')

class PushInSeeder extends InputNodeSeeder {

  static generateSlots() {
    return [
      FloatOutSlotSeeder.generate({
        name: PushIn.SLOT_NAME,
        unit: Slot.ANY_UNIT_STRING,
      }),
    ]
  }

  static generate(overrideData = {}) {
    return {
      ...super.generate(overrideData),
      subType: PushIn.SUB_TYPE,
      slots: this.generateSlots(),
      ...overrideData,
    }
  }

  static generateIntegerPushIn() {
    return this.generate({
      slots: [ IntegerOutSlotSeeder.generate() ],
    })
  }

  static generateFloatPushInKelvin() {
    return this.generate({
      slots: [ FloatOutSlotSeeder.generate({ unit: 'K' }) ],
    })
  }

}

module.exports = PushInSeeder
