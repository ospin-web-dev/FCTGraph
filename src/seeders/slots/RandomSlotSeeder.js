const ArrayUtils = require('@choux/array-utils')

const FloatInSlotSeeder = require('./FloatInSlotSeeder')
const BooleanInSlotSeeder = require('./BooleanInSlotSeeder')
const IntegerInSlotSeeder = require('./IntegerInSlotSeeder')
const OneOfInSlotSeeder = require('./OneOfInSlotSeeder')

const FloatOutSlotSeeder = require('./FloatOutSlotSeeder')
const BooleanOutSlotSeeder = require('./BooleanOutSlotSeeder')
const IntegerOutSlotSeeder = require('./IntegerOutSlotSeeder')
const OneOfOutSlotSeeder = require('./OneOfOutSlotSeeder')

const IN_SLOT_CLASS_EXPORTS = {
  FloatInSlotSeeder,
  IntegerInSlotSeeder,
  OneOfInSlotSeeder,
  BooleanInSlotSeeder,
}

const OUT_SLOT_CLASS_EXPORTS = {
  FloatOutSlotSeeder,
  IntegerOutSlotSeeder,
  OneOfOutSlotSeeder,
  BooleanOutSlotSeeder,
}

const SLOT_CLASS_EXPORTS = {
  ...IN_SLOT_CLASS_EXPORTS,
  ...OUT_SLOT_CLASS_EXPORTS,
}

class RandomSlotSeeder {

  static generate(data = {}) {
    const sampledClass = ArrayUtils.sample(
      Object.values(SLOT_CLASS_EXPORTS),
    )

    return sampledClass.generate(data)
  }

  static generateRandomOutSlot(data = {}) {
    const sampledClass = ArrayUtils.sample(
      Object.values(OUT_SLOT_CLASS_EXPORTS),
    )

    return sampledClass.generate(data)
  }

  static generateRandomInSlot(data = {}) {
    const sampledClass = ArrayUtils.sample(
      Object.values(IN_SLOT_CLASS_EXPORTS),
    )

    return sampledClass.generate(data)
  }

}

module.exports = RandomSlotSeeder
