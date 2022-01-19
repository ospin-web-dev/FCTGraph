const faker = require('faker')
const compose = require('@choux/compose')

const FactorySeeder = require('../FactorySeeder')
const SlotFactory = require('../../slots/factories/SlotFactory')
const Slot = require('../../slots/Slot')
const FunctionalitySeeder = require('../functionalities/FunctionalitySeeder')
const RandomDataGenerator = require('../../utils/RandomDataGenerator')

class SlotSeeder {

  static get DISPLAY_TYPES() {
    return [
      'temperature',
      'switch',
      'flow',
    ]
  }

  static get SEED_METHOD() { return SlotFactory.new }

  static stubOwningFct(slot) {
    // eslint-disable-next-line
    slot.functionality = FunctionalitySeeder.generate({
      slots: [ slot ],
    })
    return slot
  }

  static generate(data = {}) {
    return {
      name: RandomDataGenerator.frog(),
      displayType: RandomDataGenerator.arrayItem(SlotSeeder.DISPLAY_TYPES),
      dataStreams: [],
      unit: RandomDataGenerator.arrayItem(Slot.ALL_UNIT_VALUES || ['a', 'b', 'c']),
      ...data,
    }
  }

}

module.exports = compose([ FactorySeeder ])(SlotSeeder)
