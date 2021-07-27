const FloatInSlotSeeder = require('./FloatInSlotSeeder')
const BooleanInSlotSeeder = require('./BooleanInSlotSeeder')
const IntegerInSlotSeeder = require('./IntegerInSlotSeeder')
const OneOfInSlotSeeder = require('./OneOfInSlotSeeder')

const FloatOutSlotSeeder = require('./FloatOutSlotSeeder')
const BooleanOutSlotSeeder = require('./BooleanOutSlotSeeder')
const IntegerOutSlotSeeder = require('./IntegerOutSlotSeeder')
const OneOfOutSlotSeeder = require('./OneOfOutSlotSeeder')

const RandomSlotSeeder = require('./RandomSlotSeeder')

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

module.exports = {
  ...IN_SLOT_CLASS_EXPORTS,
  ...OUT_SLOT_CLASS_EXPORTS,
  RandomSlotSeeder,
}
