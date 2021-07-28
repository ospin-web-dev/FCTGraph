const InSlot = require('../../slots/InSlot')
const SlotSeeder = require('./SlotSeeder')

class InSlotSeeder extends SlotSeeder {

  static generate(data = {}) {
    return {
      ...super.generate(data),
      type: InSlot.TYPE,
      ...data,
    }
  }

  static generateCelciusIn(data) {
    return this.generate({
      unit: '°C',
      name: 'Celcius In',
      ...data,
    })
  }

  static generateKelvinIn(data) {
    return this.generate({
      unit: 'K',
      name: 'kelvin in',
      ...data,
    })
  }

  static generateUnitlessIn(data) {
    return this.generate({
      unit: InSlot.UNITLESS_UNIT,
      name: 'unitless in',
      ...data,
    })
  }

  static seedCelciusIn(data) {
    return this.seedOne(
      this.generateCelciusIn(data),
    )
  }

  static seedKelvinIn(data) {
    return this.seedOne(
      this.generateKelvinIn(data),
    )
  }

}

module.exports = InSlotSeeder
