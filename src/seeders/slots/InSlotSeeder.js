const faker = require('faker')

const InSlot = require('../../slots/InSlot')
const FloatInSlot = require('../../slots/FloatInSlot')
const IntegerInSlot = require('../../slots/IntegerInSlot')
const BooleanInSlot = require('../../slots/BooleanInSlot')
const OneOfInSlot = require('../../slots/OneOfInSlot')
const SlotSeeder = require('./SlotSeeder')

class InSlotSeeder extends SlotSeeder {

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

  static generateMinMaxDefaultValueAndSelectOptionsForInteger({ min, max, defaultValue }) {
    const { min: floatMin, max: floatMax } = this.generateMinMax(min, max, defaultValue)
    const integerMin = Math.round(floatMin)
    const integerMax = Math.round(floatMax)
    const integerDefault = (
      defaultValue
      || faker.datatype.number({ min: integerMin, max: integerMax })
    )

    return {
      min: integerMin,
      max: integerMax,
      defaultValue: integerDefault,
    }
  }

  static generateMinMaxDefaultValueAndSelectOptionsForFloat({ min, max, defaultValue }) {
    const { min: floatMin, max: floatMax } = this.generateMinMax(min, max, defaultValue)
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

  static generateMinMaxDefaultValueAndSelectOptionsFromData({ dataType, min, max, defaultValue }) {
    const dataTypeDispatch = {
      integer: () => this.generateMinMaxDefaultValueAndSelectOptionsForInteger(
        { min, max, defaultValue },
      ),
      float: () => this.generateMinMaxDefaultValueAndSelectOptionsForFloat(
        { min, max, defaultValue },
      ),
      boolean: () => ({
        defaultValue: defaultValue || faker.datatype.boolean(),
      }),
      oneOf: () => ({
        selectOptions: ['angela', 'merkel'],
        defaultValue: defaultValue || faker.random.arrayElement(['angela', 'merkel']),
      }),
    }

    return dataTypeDispatch[dataType]()
  }

  static generate(data = {}) {
    const slotData = super.generate(data)
    slotData.dataType = data.dataType || faker.random
      .arrayElement([
        FloatInSlot.DATA_TYPE,
        IntegerInSlot.DATA_TYPE,
        BooleanInSlot.DATA_TYPE,
        OneOfInSlot.DATA_TYPE,
      ])

    return {
      ...slotData,
      tareable: faker.datatype.boolean(),
      type: 'InSlot',
      ...this.generateMinMaxDefaultValueAndSelectOptionsFromData(slotData),
    }
  }

  /* *******************************************************************
   * PRESETS
   * **************************************************************** */
  static generateUnitlessIn(data) {
    return this.generate({
      unit: InSlot.UNITLESS_UNIT,
      name: 'unitless in',
      dataType: FloatInSlot.DATA_TYPE,
      ...data,
    })
  }

  static generateCelciusIn(data) {
    return this.generate({
      unit: '°C',
      name: 'celcius in',
      dataType: FloatInSlot.DATA_TYPE,
      ...data,
    })
  }

  static seedCelciusIn(data) {
    return this.seedOne(
      this.generateCelciusIn(data),
    )
  }

  static generateKelvinIn(data) {
    return this.generate({
      unit: 'K',
      name: 'kelvin in',
      dataType: FloatInSlot.DATA_TYPE,
      ...data,
    })
  }

  static seedKelvinIn(data) {
    return this.seedOne(
      this.generateKelvinIn(data),
    )
  }

}

module.exports = InSlotSeeder
