const OutputNodeSeeder = require('seeders/functionalities/OutputNodeSeeder')
const { InSlotSeeder } = require('seeders/slots')
const PushOut = require('functionalities/PushOut')

class PushOutSeeder extends OutputNodeSeeder {

  static get SLOT_SEEDS() {
    return [
      InSlotSeeder.generateUnitlessIn({ name: 'value in' }),
    ]
  }

  static generate(overrideData = {}) {
    const fctData = {
      ...super.generate(overrideData),
      subType: PushOut.SUB_TYPE,
    }

    return {
      ...fctData,
      slots: [ ...this.generateSlots(overrideData.id || fctData.id) ],
      ...overrideData,
    }
  }

}

module.exports = PushOutSeeder
