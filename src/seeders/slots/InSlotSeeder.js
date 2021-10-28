const InSlot = require('../../slots/InSlot')
const SlotSeeder = require('./SlotSeeder')

class InSlotSeeder extends SlotSeeder {

  static get DISPLAY_TYPES() {
    return [...super.DISPLAY_TYPES, InSlot.CONTROLLER_PARAMETER_DISPLAY_TYPE]
  }

  static generate(data = {}) {
    return {
      ...super.generate(data),
      type: InSlot.TYPE,
      ...data,
    }
  }

  static generateCelsiusIn(data) {
    return this.generate({
      unit: '°C',
      name: 'Celsius In',
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

  static generateControllerParameterSlot(data) {
    return this.generateUnitlessIn(
      { ...data, displayType: InSlot.CONTROLLER_PARAMETER_DISPLAY_TYPE },
    )
  }

  static seedCelsiusIn(data) {
    return this.seedOne(
      this.generateCelsiusIn(data),
    )
  }

  static seedKelvinIn(data) {
    return this.seedOne(
      this.generateKelvinIn(data),
    )
  }

}

module.exports = InSlotSeeder
