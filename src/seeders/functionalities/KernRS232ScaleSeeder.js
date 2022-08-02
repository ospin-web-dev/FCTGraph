const SensorSeeder = require('./SensorSeeder')
const { FloatOutSlotSeeder } = require('../slots')
const KernRS232Scale = require('../../functionalities/KernRS232Scale')

class KernRS232ScaleSeeder extends SensorSeeder {

  static generateSlots() {
    return [
      FloatOutSlotSeeder.generate({ name: 'weight', unit: 'g' }),
    ]
  }

  static generate(overrideData = {}) {
    return {
      ...super.generate(overrideData),
      subType: KernRS232Scale.SUB_TYPE,
      slots: this.generateSlots(),
      ...overrideData,
    }
  }

}

module.exports = KernRS232ScaleSeeder
