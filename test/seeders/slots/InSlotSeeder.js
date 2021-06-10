const faker = require('faker')

const InSlot = require('slots/InSlot')
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
      selectOptions: undefined,
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
      selectOptions: undefined,
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
        max: undefined,
        min: undefined,
        selectOptions: undefined,
        defaultValue: defaultValue || faker.datatype.boolean(),
      }),
      oneOf: () => ({
        max: undefined,
        min: undefined,
        selectOptions: ['angela', 'merkel'],
        defaultValue: defaultValue || faker.random.arrayElement(['angela', 'merkel']),
      }),
    }

    return dataTypeDispatch[dataType]()
  }

  static generate(data = {}) {
    const slotData = super.generate(data)
    slotData.dataType = data.dataType || faker.random.arrayElement(Object.values(InSlot.DATA_TYPES))

    /* this method will delegate and attempt to build fake data based
     * off of what the user has provided. e.g. if the user provided a
     * max value, it will try to give sensible min and defaultValues.
     * the reason all of these values are generated at once is because
     * they are all, per the JOI SCHEMA, related
     */
    const { min, max, defaultValue, selectOptions } = (
      this.generateMinMaxDefaultValueAndSelectOptionsFromData(slotData)
    )

    // this parses out keys that have undefined values
    const optionals = InSlot.SERIALIZE_OPTIONAL_DATA({
      min, max, selectOptions,
    })

    return {
      ...slotData,
      ...optionals,
      defaultValue,
      type: 'InSlot',
    }
  }

  /* *******************************************************************
   * PRESETS
   * **************************************************************** */
  static generateUnitlessIn(data) {
    return this.generate({
      unit: InSlot.UNITLESS_UNIT,
      name: 'unitless in',
      dataType: InSlot.DATA_TYPES.FLOAT,
      ...data,
    })
  }

  static generateCelciusIn(data) {
    return this.generate({
      unit: '°C',
      name: 'celcius in',
      dataType: InSlot.DATA_TYPES.FLOAT,
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
      dataType: InSlot.DATA_TYPES.FLOAT,
      ...data,
    })
  }

}

module.exports = InSlotSeeder
