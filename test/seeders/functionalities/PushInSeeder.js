const InputNodeSeeder = require('test/seeders/functionalities/InputNodeSeeder')
const { OutSlotSeeder } = require('test/seeders/slots')
const PushIn = require('functionalities/PushIn')

class PushInSeeder extends InputNodeSeeder {

  static get SLOT_SEEDS() {
    return [
      OutSlotSeeder.generate({ name: 'value out' }),
    ]
  }

  static generate(data) {
    return {
      ...super.generate(data),
      subType: PushIn.SUB_TYPE,
      slots: [ ...this.SLOT_SEEDS ],
      ...data,
    }
  }

}

module.exports = PushInSeeder
