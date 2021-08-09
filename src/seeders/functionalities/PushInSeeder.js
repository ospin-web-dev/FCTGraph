const InputNodeSeeder = require('./InputNodeSeeder')
const {
  RandomSlotSeeder,
  IntegerOutSlotSeeder,
  FloatOutSlotSeeder,
} = require('../slots')
const PushIn = require('../../functionalities/PushIn')

class PushInSeeder extends InputNodeSeeder {

  static generateSlots() {
    return [
      RandomSlotSeeder.generateRandomOutSlot({ name: 'value out' }),
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
