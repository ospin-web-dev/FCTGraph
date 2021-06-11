const InputNodeSeeder = require('seeders/functionalities/InputNodeSeeder')
const { OutSlotSeeder } = require('seeders/slots')
const PushIn = require('functionalities/PushIn')

class PushInSeeder extends InputNodeSeeder {

  static get SLOT_SEEDS() {
    return [
      OutSlotSeeder.generate({ name: 'value out' }),
    ]
  }

  static generate(overrideData = {}) {
    const fctData = {
      ...super.generate(overrideData),
      subType: PushIn.SUB_TYPE,
    }

    return {
      ...fctData,
      slots: [ ...this.generateSlots(overrideData.id || fctData.id) ],
      ...overrideData,
    }
  }

}

module.exports = PushInSeeder
