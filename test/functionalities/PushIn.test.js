const {
  PushInSeeder,
  HeaterActuatorSeeder,
} = require('seeders/functionalities')
const {
  FloatOutSlotSeeder,
  FloatInSlotSeeder,
} = require('seeders/slots')

describe('the PushIn Functionality', () => {
  describe('getSinkFct', () => {
    it('returns the sole sink functionality', () => {
      const inSlot = FloatInSlotSeeder.seedCelsiusIn()
      const outSlot = FloatOutSlotSeeder.seedCelsiusOut()
      const heaterFct = HeaterActuatorSeeder.seedOne({ slots: [ inSlot ] })
      const pushInFct = PushInSeeder.seedOne({ slots: [ outSlot ] })

      pushInFct.outSlots[0].connectTo(heaterFct.inSlots[0])

      const sinkFct = pushInFct.getSinkFct()

      expect(sinkFct).toStrictEqual(heaterFct)
    })
  })
})
