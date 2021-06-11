const OutputNodeSeeder = require('seeders/functionalities/OutputNodeSeeder')
const { InSlotSeeder } = require('seeders/slots')
const IntervalOut = require('functionalities/IntervalOut')

class IntervalOutSeeder extends OutputNodeSeeder {

  static get SLOT_SEEDS() {
    return [
      InSlotSeeder.generate({ name: 'value in' }),
    ]
  }

  static generate(overrideData = {}) {
    const fctData = {
      ...super.generate(overrideData),
      subType: IntervalOut.SUB_TYPE,
    }

    return {
      ...fctData,
      slots: [ ...this.generateSlots(overrideData.id || fctData.id) ],
      ...overrideData,
    }
  }

}

module.exports = IntervalOutSeeder
