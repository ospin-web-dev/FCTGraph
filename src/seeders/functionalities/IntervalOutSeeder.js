const OutputNodeSeeder = require('./OutputNodeSeeder')
const { FloatInSlotSeeder } = require('../slots')
const IntervalOut = require('../../functionalities/IntervalOut')

class IntervalOutSeeder extends OutputNodeSeeder {

  static generateSlots() {
    return [
      FloatInSlotSeeder.generate({ name: IntervalOut.SLOT_NAME }),
    ]
  }

  static generate(overrideData = {}) {
    return {
      ...super.generate(overrideData),
      subType: IntervalOut.SUB_TYPE,
      slots: this.generateSlots(),
      publishIntervalMs: IntervalOut.DEFAULT_PUBLISH_INTERVAL,
      ...overrideData,
    }
  }

  static generateFloatIntervalOutCelsius(overrideData) {
    return this.generate({
      slots: [
        FloatInSlotSeeder.generate({ name: 'value in', unit: '°C' }),
      ],
      ...overrideData,
    })
  }

}

module.exports = IntervalOutSeeder
