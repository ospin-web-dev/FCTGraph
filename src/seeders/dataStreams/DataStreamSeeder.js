const faker = require('faker')
const compose = require('@choux/compose')

const FactorySeeder = require('../FactorySeeder')
const DataStream = require('../../dataStreams/DataStream')

/* NOTE:
 * This class should not be documented as public interface. Consumers
 * should instead be guided to make use of other seeders and helper
 * methods (e.g. seed slots, then connect them with the instance methods) */
class DataStreamSeeder {

  static get SEED_METHOD() { return (...data) => new DataStream(...data) }

  static generate(data = {}) {
    return {
      id: faker.datatype.uuid(),
      sourceFctId: faker.datatype.uuid(),
      sourceSlotName: faker.animal.lion(),
      sinkFctId: faker.datatype.uuid(),
      sinkSlotName: faker.animal.lion(),
      averagingWindowSize: faker.datatype.number({
        min: 0, max: 1000000,
      }),
      ...data,
    }
  }

}

module.exports = compose([ FactorySeeder ])(DataStreamSeeder)
