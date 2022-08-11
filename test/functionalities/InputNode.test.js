const InputNode = require('functionalities/InputNode')
const InputNodeSeeder = require('seeders/functionalities/InputNodeSeeder')
const {
  PushInSeeder,
  HeaterActuatorSeeder,
} = require('seeders/functionalities')
const {
  FloatOutSlotSeeder,
  FloatInSlotSeeder,
} = require('seeders/slots')

describe('the InputNode Functionality', () => {

  describe('getSinkFct', () => {
    it('returns the sole sink functionality', () => {
      const inSlotData = FloatInSlotSeeder.generateCelsiusIn()
      const outSlotData = FloatOutSlotSeeder.generateCelsiusOut()
      const heaterFct = HeaterActuatorSeeder.seedOne({ slots: [ inSlotData ] })
      const pushInFct = PushInSeeder.seedOne({ slots: [ outSlotData ] })

      pushInFct.outSlots[0].connectTo(heaterFct.inSlots[0])

      const sinkFct = pushInFct.getSinkFct()

      expect(sinkFct).toStrictEqual(heaterFct)
    })
  })

  describe('getConnectingSinkSlot', () => {
    it('returns the connecting slot of the source fct', () => {
      const inSlotData = FloatInSlotSeeder.generateCelsiusIn()
      const outSlotData = FloatOutSlotSeeder.generateCelsiusOut()
      const heaterFct = HeaterActuatorSeeder.seedOne({ slots: [ inSlotData ] })
      const pushInFct = PushInSeeder.seedOne({ slots: [ outSlotData ] })

      pushInFct.outSlots[0].connectTo(heaterFct.inSlots[0])

      const sinkSlot = pushInFct.getConnectingSinkSlot()

      expect(sinkSlot).toStrictEqual(heaterFct.inSlots[0])
    })
  })
})
