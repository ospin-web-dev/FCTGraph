const OutSlot = require('../../slots/OutSlot')
const SlotSeeder = require('./SlotSeeder')
const DataStreamSeeder = require('../dataStreams/DataStreamSeeder')

class OutSlotSeeder extends SlotSeeder {

  static generate(data = {}) {
    return {
      ...super.generate(data),
      type: OutSlot.TYPE,
      ...data,
    }
  }

  static seedWithDataStream(data) {
    const slot = this.seedOne(
      this.generate(data),
    )

    const dataStream = DataStreamSeeder.seedOne({
      sourceSlotName: slot.name,
    })

    slot._addDataStreamAndAssertStructure(dataStream)

    return slot
  }

  static generateCelciusOut(data) {
    return this.generate({
      unit: '°C',
      name: 'Celcius Out',
      ...data,
    })
  }

  static seedCelciusOut(data) {
    return this.seedOne(
      this.generateCelciusOut(data),
    )
  }

}

module.exports = OutSlotSeeder
