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

  static generateCelciusOut(data) {
    return this.generate({
      unit: '°C',
      name: 'Celcius Out',
      ...data,
    })
  }

  static seedCelciusOut(data) {
    return this.seedOne(
      this.generateCelciusOut(data),
    )
  }

}

module.exports = OutSlotSeeder
