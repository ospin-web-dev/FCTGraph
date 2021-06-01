const faker = require('faker')
const compose = require('@choux/compose')

const SlotFactory = require('slots/factories/SlotFactory')
const SlotSeeder = require('./SlotSeeder')
const FactorySeeder = require('../FactorySeeder')

class InSlotSeeder extends SlotSeeder {

  static get Factory() { return SlotFactory }

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

    return {
      ...slotData,
      ...this.generateMinMaxDefaultValueAndSelectOptionsFromData(slotData),
      type: 'InSlot',
    }
  }

}

module.exports = compose([ FactorySeeder ])(InSlotSeeder)
