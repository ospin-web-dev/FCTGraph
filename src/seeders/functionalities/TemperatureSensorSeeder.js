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
  static generateCelciusIntegerProducer(data) {
    return this.generate({
      slots: [ IntegerOutSlotSeeder.generateCelciusOut() ],
      ...data,
    })
  }

  static generateCelciusFloatProducer(data) {
    return this.generate({
      slots: [ FloatOutSlotSeeder.generateCelciusOut() ],
      ...data,
    })
  }

  static generateCelciusProducer() {
    const generator = ArrayUtils.sample([
      this.generateCelciusIntegerProducer.bind(this),
      this.generateCelciusFloatProducer.bind(this),
    ])

    return generator({
      name: 'Temperature Producer',
    })
  }

}

module.exports = TemperatureSensorSeeder
