const faker = require('faker')

const OutSlot = require('../../slots/OutSlot')
const SlotSeeder = require('./SlotSeeder')
const DataStream = require('../../dataStreams/DataStream')

class OutSlotSeeder extends SlotSeeder {

  static generate(data = {}) {
    return {
      ...super.generate(data),
      type: 'OutSlot',
      dataType: faker.random.arrayElement(Object.values(OutSlot.DATA_TYPES)),
      ...data,
    }
  }

  /* *******************************************************************
   * PRESETS
   * **************************************************************** */
  static generateCelciusOut(data) {
    return this.generate({
      unit: '°C',
      name: 'Celcius Out',
      dataType: OutSlot.DATA_TYPES.FLOAT,
      ...data,
    })
  }

  static seedCelciusOut(data) {
    return this.seedOne(
      this.generateCelciusOut(data),
    )
  }

  static seedWithDataStream(data) {
    const slot = this.seedOne(
      this.generate(data),
    )

    const dataStream = new DataStream({
      id: faker.datatype.uuid(),
      sourceFctId: faker.datatype.uuid(),
      sourceSlotName: slot.name,
      sinkFctId: faker.datatype.uuid(),
      sinkSlotName: faker.animal.lion(),
      averagingWindowSize: faker.datatype.number(),
    })

    slot._addDataStreamAndAssertStructure(dataStream)

    return slot
  }

}

module.exports = OutSlotSeeder
