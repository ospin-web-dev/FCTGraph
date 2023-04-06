const RandomDataGenerator = require('../../utils/RandomDataGenerator')
const Slot = require('../../slots/Slot')

const _generate = (data = {}) => (
  Slot.create({
    name: RandomDataGenerator.frog(),
    displayType: RandomDataGenerator.frog(),
    dataStreams: [],
    unit: RandomDataGenerator.arrayItem(['°C', 'rpm', '-']),
    ...data,
  })
)

const generateIntegerInSlot = (data = {}) => {
  const min = RandomDataGenerator.integer()
  const max = RandomDataGenerator.integer() + min + 2
  const defaultValue = min + 1

  return _generate({
    type: Slot.TYPES.IN_SLOT,
    dataType: Slot.DATA_TYPES.INTEGER,
    min,
    max,
    defaultValue,
    tareable: true,
    ...data,
  })
}

const generateIntegerOutSlot = (data = {}) => (
  _generate({
    type: Slot.TYPES.OUT_SLOT,
    dataType: Slot.DATA_TYPES.INTEGER,
    ...data,
  })
)

const generateFloatInSlot = (data = {}) => {
  const min = RandomDataGenerator.float()
  const max = RandomDataGenerator.float() + min + 2
  const defaultValue = min + 1

  return _generate({
    type: Slot.TYPES.IN_SLOT,
    dataType: Slot.DATA_TYPES.FLOAT,
    min,
    max,
    defaultValue,
    tareable: true,
    ...data,
  })
}

const generateFloatOutSlot = (data = {}) => (
  _generate({
    type: Slot.TYPES.OUT_SLOT,
    dataType: Slot.DATA_TYPES.FLOAT,
    ...data,
  })
)

const generateBooleanInSlot = (data = {}) => (
  _generate({
    type: Slot.TYPES.IN_SLOT,
    dataType: Slot.DATA_TYPES.BOOLEAN,
    defaultValue: false,
    ...data,
  })
)

const generateBooleanOutSlot = (data = {}) => (
  _generate({
    type: Slot.TYPES.OUT_SLOT,
    dataType: Slot.DATA_TYPES.BOOLEAN,
    ...data,
  })
)

const generateOneOfInSlot = (data = {}) => {
  const options = [
    RandomDataGenerator.frog(),
    `Super ${RandomDataGenerator.frog()}`,
  ]

  return _generate({
    type: Slot.TYPES.IN_SLOT,
    dataType: Slot.DATA_TYPES.ONE_OF,
    defaultValue: RandomDataGenerator.arrayItem(options),
    selectOptions: options,
    ...data,
  })
}

const generateOneOfOutSlot = (data = {}) => (
  _generate({
    type: Slot.TYPES.OUT_SLOT,
    dataType: Slot.DATA_TYPES.ONE_OF,
    ...data,
  })
)

const generateAnyInSlot = (data = {}) => (
  _generate({
    type: Slot.TYPES.IN_SLOT,
    dataType: Slot.DATA_TYPES.ANY,
    unit: Slot.ANY_UNIT_STRING,
    ...data,
  })
)

const generateAnyOutSlot = (data = {}) => (
  _generate({
    type: Slot.TYPES.OUT_SLOT,
    dataType: Slot.DATA_TYPES.ANY,
    unit: Slot.ANY_UNIT_STRING,
    ...data,
  })
)

const generateAnyNumberInSlot = (data = {}) => (
  _generate({
    type: Slot.TYPES.IN_SLOT,
    dataType: Slot.DATA_TYPES.ANY_NUMBER,
    unit: Slot.ANY_UNIT_STRING,
    ...data,
  })
)

const generateAnyNumberOutSlot = (data = {}) => (
  _generate({
    type: Slot.TYPES.OUT_SLOT,
    dataType: Slot.DATA_TYPES.ANY_NUMBER,
    unit: Slot.ANY_UNIT_STRING,
    ...data,
  })
)

module.exports = {
  generateIntegerInSlot,
  generateIntegerOutSlot,
  generateFloatInSlot,
  generateFloatOutSlot,
  generateBooleanInSlot,
  generateBooleanOutSlot,
  generateOneOfInSlot,
  generateOneOfOutSlot,
  generateAnyInSlot,
  generateAnyOutSlot,
  generateAnyNumberInSlot,
  generateAnyNumberOutSlot
}
