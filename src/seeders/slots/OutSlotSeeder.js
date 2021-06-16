const faker = require('faker')

const OutSlot = require('../../slots/OutSlot')
const SlotSeeder = require('./SlotSeeder')

class OutSlotSeeder extends SlotSeeder {

  static generate(data = {}) {
    return {
      ...super.generate(data),
      type: 'OutSlot',
      dataType: faker.random.arrayElement(Object.values(OutSlot.DATA_TYPES)),
      ...data,
    }
  }

  /* *******************************************************************
   * PRESETS
   * **************************************************************** */
  static generateCelciusOut(data) {
    return this.generate({
      unit: '°C',
      name: 'Celcius Out',
      dataType: OutSlot.DATA_TYPES.FLOAT,
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
