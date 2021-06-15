const InputNodeSeeder = require('seeders/functionalities/InputNodeSeeder')
const { OutSlotSeeder } = require('seeders/slots')
const PushIn = require('functionalities/PushIn')

class PushInSeeder extends InputNodeSeeder {

  static generateSlots() {
    return [
      OutSlotSeeder.generate({ name: 'value out' }),
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

}

module.exports = PushInSeeder
