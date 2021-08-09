const ArrayUtils = require('@choux/array-utils')

const SensorSeeder = require('./SensorSeeder')
const {
  FloatOutSlotSeeder,
  IntegerOutSlotSeeder,
} = require('../slots')
const TemperatureSensor = require('../../functionalities/TemperatureSensor')

class TemperatureSensorSeeder extends SensorSeeder {

  static get VALID_OUT_SLOT_SEEDERS() {
    return [
      FloatOutSlotSeeder,
      IntegerOutSlotSeeder,
    ]
  }

  static generateSlots(overrideSlotData) {
    return [
      ArrayUtils.sample(this.VALID_OUT_SLOT_SEEDERS).generate({
        name: 'value out',
        ...overrideSlotData,
      }),
    ]
  }

  static generate(overrideData = {}) {
    return {
      ...super.generate(overrideData),
      subType: TemperatureSensor.SUB_TYPE,
      slots: this.generateSlots(),
      ...overrideData,
    }
  }

  /* *******************************************************************
   * PRESETS
   * **************************************************************** */
  static generateCelsiusIntegerProducer(data) {
    return this.generate({
      slots: [ IntegerOutSlotSeeder.generateCelsiusOut() ],
      ...data,
    })
  }

  static generateCelsiusFloatProducer(data) {
    return this.generate({
      slots: [ FloatOutSlotSeeder.generateCelsiusOut() ],
      ...data,
    })
  }

  static generateCelsiusProducer() {
    const generator = ArrayUtils.sample([
      this.generateCelsiusIntegerProducer.bind(this),
      this.generateCelsiusFloatProducer.bind(this),
    ])

    return generator({
      name: 'Temperature Producer',
    })
  }

}

module.exports = TemperatureSensorSeeder
