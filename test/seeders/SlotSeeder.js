const faker = require('faker')
const compose = require('@choux/compose')

const FactorySeeder = require('./FactorySeeder')
const SlotFactory = require('../../src/slots/factories/SlotFactory')
const Slot = require('../../src/slots/Slot')

class SlotSeeder {

  static get Factory() { return SlotFactory }

  static generateInSlotData({ dataType }) {
    const min = faker.datatype.number({ min: -90, max: 10 })
    const max = faker.datatype.number({ min: 11, max: 111 })

    const defaultValueFromDataTypeDispatch = {
      integer: () => (faker.datatype.number({ min, max })),
      float: () => (faker.datatype.float({ min, max })),
      boolean: () => faker.datatype.boolean(),
      string: () => (faker.random.arrayElement(['angela', 'merkel'])),
    }

    return {
      min,
      max,
      defaultValue: defaultValueFromDataTypeDispatch[dataType](),
    }
  }

  static generateTypeSpecificData(data) {
    const typeGeneratorDispatch = {
      InSlot: this.generateInSlotData,
      OutSlot: () => ({}),
    }

    return typeGeneratorDispatch[data.type](data)
  }

  static generate(data) {
    const dataType = data.dataType || (
      faker.random.arrayElement(Object.values(Slot.DATA_TYPES))
    )

    const type = data.type || (
      faker.random.arrayElement(
        SlotFactory.SUPPORTED_CLASSES.map(slotClass => slotClass.TYPE),
      )
    )
    console.error(type)

    return {
      name: faker.animal.lion(),
      type,
      dataType,
      displayType: faker.random.arrayElement(Object.values(Slot.DISPLAY_TYPES)),
      dataStreams: [],
      unit: faker.random.arrayElement(Slot.ALL_UNIT_VALUES),
      ...this.generateTypeSpecificData({ type, dataType }),
      ...data,
    }
  }

}

module.exports = compose([ FactorySeeder ])(SlotSeeder)
