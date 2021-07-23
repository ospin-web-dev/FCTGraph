const ArrayUtils = require('@choux/array-utils')

const SlotSeeder = require('./SlotSeeder')

const FloatInSlotSeeder = require('./FloatInSlotSeeder')
const BooleanInSlotSeeder = require('./BooleanInSlotSeeder')
const IntegerInSlotSeeder = require('./IntegerInSlotSeeder')
const OneOfInSlotSeeder = require('./OneOfInSlotSeeder')

const FloatOutSlotSeeder = require('./FloatOutSlotSeeder')
const BooleanOutSlotSeeder = require('./BooleanOutSlotSeeder')
const IntegerOutSlotSeeder = require('./IntegerOutSlotSeeder')
const OneOfOutSlotSeeder = require('./OneOfOutSlotSeeder')

const IN_SLOT_SEEDERS = {
  FloatInSlotSeeder,
  IntegerInSlotSeeder,
  OneOfInSlotSeeder,
  BooleanInSlotSeeder,
}

const OUT_SLOT_SEEDERS = {
  FloatOutSlotSeeder,
  IntegerOutSlotSeeder,
  OneOfOutSlotSeeder,
  BooleanOutSlotSeeder,
}

const ALL_SLOT_SEEDERS = {
  ...IN_SLOT_SEEDERS,
  ...OUT_SLOT_SEEDERS,
}

class RandomSlotSeeder extends SlotSeeder {

  static generate(data = {}) {
    const SampledSeeder = ArrayUtils.sample(
      Object.values(ALL_SLOT_SEEDERS),
    )

    return SampledSeeder.generate(data)
  }

  static generateRandomOutSlot(data = {}) {
    const sampledClass = ArrayUtils.sample(
      Object.values(OUT_SLOT_SEEDERS),
    )

    return sampledClass.generate(data)
  }

  static generateRandomInSlot(data = {}) {
    const sampledClass = ArrayUtils.sample(
      Object.values(IN_SLOT_SEEDERS),
    )

    return sampledClass.generate(data)
  }

}

module.exports = RandomSlotSeeder
