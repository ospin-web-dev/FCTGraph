const OutputNodeSeeder = require('seeders/functionalities/OutputNodeSeeder')
const { InSlotSeeder } = require('seeders/slots')
const PushOut = require('functionalities/PushOut')

class PushOutSeeder extends OutputNodeSeeder {

  static get SLOT_SEEDS() {
    return [
      InSlotSeeder.generateUnitlessIn({ name: 'value in' }),
    ]
  }

  static generate(data) {
    return {
      ...super.generate(data),
      subType: PushOut.SUB_TYPE,
      slots: [ ...this.SLOT_SEEDS ],
      ...data,
    }
  }

}

module.exports = PushOutSeeder
