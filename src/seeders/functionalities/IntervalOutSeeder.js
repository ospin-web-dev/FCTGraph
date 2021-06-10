const OutputNodeSeeder = require('seeders/functionalities/OutputNodeSeeder')
const { InSlotSeeder } = require('seeders/slots')
const IntervalOut = require('functionalities/IntervalOut')

class IntervalOutSeeder extends OutputNodeSeeder {

  static get SLOT_SEEDS() {
    return [
      InSlotSeeder.generate({ name: 'value in' }),
    ]
  }

  static generate(data) {
    return {
      ...super.generate(data),
      subType: IntervalOut.SUB_TYPE,
      slots: [ ...this.SLOT_SEEDS ],
      ...data,
    }
  }

}

module.exports = IntervalOutSeeder
