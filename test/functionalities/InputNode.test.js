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
  describe('.constructor', () => {
    describe('re: assigning default values', () => {
      it('assigns `source` to the class default if none is provided', () => {
        const inputNodeData = InputNodeSeeder.generate()
        delete inputNodeData.destination

        const inputNode = new InputNode(inputNodeData)

        expect(inputNode.source).toStrictEqual(
          InputNode.DEFAULT_SOURCE,
        )
      })
    })
  })

  describe('.serialize', () => {
    it('serializes with the source included', () => {
      const source = { name: 'bauer sucht frau' }
      const inputNodeData = InputNodeSeeder.generate({ source })

      const inputNode = new InputNode(inputNodeData)

      expect(inputNode.serialize().source).toStrictEqual(source)
    })
  })

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
