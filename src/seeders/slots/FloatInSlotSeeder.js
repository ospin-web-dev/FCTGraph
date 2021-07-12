const faker = require('faker')

const FloatInSlot = require('../../slots/FloatInSlot')
const InSlotSeeder = require('./InSlotSeeder')

class FloatInSlotSeeder extends InSlotSeeder {

  static get MIN_BOUNDS() { return { min: -90, max: 10 } }

  static get MAX_BOUNDS() { return { min: 11, max: 111 } }

  static generateMinMax(min, max, defaultValue) {
    const generatedMin = min || faker.datatype.float(this.MIN_BOUNDS)
    const generatedMax = max || faker.datatype.float(this.MAX_BOUNDS)

    return {
      min: defaultValue < generatedMin ? defaultValue : generatedMin,
      max: defaultValue > generatedMax ? defaultValue : generatedMax,
    }
  }

  static generateMinMaxDefaultValue({ min, max, defaultValue }) {
    const { min: floatMin, max: floatMax } = FloatInSlotSeeder
      .generateMinMax(min, max, defaultValue)
    const floatDefault = (
      defaultValue
      || faker.datatype.float({ min: floatMin, max: floatMax })
    )

    return {
      min: floatMin > defaultValue ? defaultValue : floatMin,
      max: floatMax < defaultValue ? defaultValue : floatMax,
      defaultValue: floatDefault,
    }
  }

  static generate(data = {}) {
    const slotData = super.generate(data)

    return {
      ...slotData,
      tareable: faker.datatype.boolean(),
      dataType: FloatInSlot.DATA_TYPE,
      ...FloatInSlotSeeder.generateMinMaxDefaultValue(slotData),
      ...data,
    }
  }

  /* *******************************************************************
   * PRESETS
   * **************************************************************** */
  static generateUnitlessIn(data) {
    return FloatInSlotSeeder.generate({
      unit: FloatInSlot.UNITLESS_UNIT,
      name: 'unitless in',
      dataType: FloatInSlot.DATA_TYPE,
      ...data,
    })
  }

  static generateCelciusIn(data) {
    return FloatInSlotSeeder.generate({
      unit: '°C',
      name: 'celcius in',
      dataType: FloatInSlot.DATA_TYPE,
      ...data,
    })
  }

  static seedCelciusIn(data) {
    return super.seedOne(
      FloatInSlotSeeder.generateCelciusIn(data),
    )
  }

  static generateKelvinIn(data) {
    return FloatInSlotSeeder.generate({
      unit: 'K',
      name: 'kelvin in',
      dataType: FloatInSlot.DATA_TYPE,
      ...data,
    })
  }

  static seedKelvinIn(data) {
    return super.seedOne(
      FloatInSlotSeeder.generateKelvinIn(data),
    )
  }

}

module.exports = FloatInSlotSeeder
