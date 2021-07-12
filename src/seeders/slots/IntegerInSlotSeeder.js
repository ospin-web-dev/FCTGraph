const faker = require('faker')

const IntegerInSlot = require('../../slots/IntegerInSlot')
const InSlotSeeder = require('./InSlotSeeder')

class IntegerInSlotSeeder extends InSlotSeeder {

  static get MIN_BOUNDS() { return { min: -90, max: 10 } }

  static get MAX_BOUNDS() { return { min: 11, max: 111 } }

  static generateMinMax(min, max, defaultValue) {
    const generatedMin = Math.round(min || faker.datatype.float(this.MIN_BOUNDS))
    const generatedMax = Math.round(max || faker.datatype.float(this.MAX_BOUNDS))

    return {
      min: defaultValue < generatedMin ? defaultValue : generatedMin,
      max: defaultValue > generatedMax ? defaultValue : generatedMax,
    }
  }

  static generateMinMaxDefaultValue({ min, max, defaultValue }) {
    const { min: integerMin, max: integerMax } = IntegerInSlotSeeder
      .generateMinMax(min, max, defaultValue)
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

  static generate(data = {}) {
    const slotData = super.generate(data)

    return {
      ...slotData,
      tareable: faker.datatype.boolean(),
      dataType: IntegerInSlot.DATA_TYPE,
      ...IntegerInSlotSeeder.generateMinMaxDefaultValue(slotData),
      ...data,
    }
  }

}

module.exports = IntegerInSlotSeeder
