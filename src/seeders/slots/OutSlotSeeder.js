const OutSlot = require('../../slots/OutSlot')
const SlotSeeder = require('./SlotSeeder')

class OutSlotSeeder extends SlotSeeder {

  static generate(data = {}) {
    return {
      ...super.generate(data),
      type: OutSlot.TYPE,
      ...data,
    }
  }

  static generateCelsiusOut(data) {
    return this.generate({
      unit: '°C',
      name: 'Celsius Out',
      ...data,
    })
  }

  static seedCelsiusOut(data) {
    return this.seedOne(
      this.generateCelsiusOut(data),
    )
  }

}

module.exports = OutSlotSeeder
