const FloatInSlotSeeder = require('./FloatInSlotSeeder')
const BooleanInSlotSeeder = require('./BooleanInSlotSeeder')
const IntegerInSlotSeeder = require('./IntegerInSlotSeeder')
const OneOfInSlotSeeder = require('./OneOfInSlotSeeder')
const AnyInSlotSeeder = require('./AnyInSlotSeeder')

const FloatOutSlotSeeder = require('./FloatOutSlotSeeder')
const BooleanOutSlotSeeder = require('./BooleanOutSlotSeeder')
const IntegerOutSlotSeeder = require('./IntegerOutSlotSeeder')
const OneOfOutSlotSeeder = require('./OneOfOutSlotSeeder')
const AnyOutSlotSeeder = require('./AnyOutSlotSeeder')

const RandomSlotSeeder = require('./RandomSlotSeeder')

const IN_SLOT_CLASS_EXPORTS = {
  FloatInSlotSeeder,
  IntegerInSlotSeeder,
  OneOfInSlotSeeder,
  BooleanInSlotSeeder,
  AnyInSlotSeeder,
}

const OUT_SLOT_CLASS_EXPORTS = {
  FloatOutSlotSeeder,
  IntegerOutSlotSeeder,
  OneOfOutSlotSeeder,
  BooleanOutSlotSeeder,
  AnyOutSlotSeeder,
}

module.exports = {
  ...IN_SLOT_CLASS_EXPORTS,
  ...OUT_SLOT_CLASS_EXPORTS,
  RandomSlotSeeder,
}
