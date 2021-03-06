const compose = require('@choux/compose')

const FloatInSlotSeeder = require('seeders/slots/FloatInSlotSeeder')
const FloatOutSlotSeeder = require('seeders/slots/FloatOutSlotSeeder')
const FactorySeeder = require('../FactorySeeder')
const DataStream = require('../../dataStreams/DataStream')
const RandomDataGenerator = require('../../utils/RandomDataGenerator')
/* NOTE:
 * This class should not be documented as public interface. Consumers
 * should instead be guided to make use of other seeders and helper
 * methods (e.g. seed slots, then connect them with the instance methods).
 * Datastreams should only exist as instances when they are created to connect
 * two slots */
class DataStreamSeeder {

  static get SEED_METHOD() { return (...data) => new DataStream(...data) }

  static generate(data = {}) {
    const sourceSlot = FloatInSlotSeeder.seedCelsiusIn()
    const sinkSlot = FloatOutSlotSeeder.seedCelsiusOut()

    FloatOutSlotSeeder.stubOwningFct(sourceSlot)
    FloatInSlotSeeder.stubOwningFct(sinkSlot)

    return {
      id: RandomDataGenerator.uuid(),
      sourceSlot,
      sinkSlot,
      averagingWindowSize: RandomDataGenerator.integer({
        min: 0, max: 1000000,
      }),
      ...data,
    }
  }

}

module.exports = compose([ FactorySeeder ])(DataStreamSeeder)
