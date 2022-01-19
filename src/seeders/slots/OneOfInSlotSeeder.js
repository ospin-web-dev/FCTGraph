const RandomDataGenerator = require('../../utils/RandomDataGenerator')

const OneOfInSlot = require('../../slots/OneOfInSlot')
const InSlotSeeder = require('./InSlotSeeder')

class OneOfInSlotSeeder extends InSlotSeeder {

  static generateSelectOptionsAndDefaultValue({ defaultValue, selectOptions }) {
    const options = ['angela', 'merkel']

    const appliedDefaultValue = (defaultValue !== null && defaultValue !== undefined)
      ? defaultValue
      : RandomDataGenerator.arrayItem(options)

    return {
      selectOptions: selectOptions || ['angela', 'merkel'],
      defaultValue: appliedDefaultValue,
    }
  }

  static generate(data = {}) {
    const slotData = super.generate(data)

    return {
      ...slotData,
      dataType: OneOfInSlot.DATA_TYPE,
      ...OneOfInSlotSeeder.generateSelectOptionsAndDefaultValue(slotData),
      ...data,
    }
  }

}

module.exports = OneOfInSlotSeeder
