const {
  IntegerInSlotSeeder,
} = require('seeders/slots')
const {
  TemperatureSensorSeeder,
} = require('seeders/functionalities')

const FCTGraph = require('fctGraph/FCTGraph')
const { mutators: { addPushInFctForAllInSlotsWhichHaveNone } } = require('fctGraph/Utils')

describe('Inslot', () => {

  describe('.inputNodeId', () => {
    describe('with a inputNodeId', () => {

      it('should return the inputNodeId', () => {
        const slotname = 'value'
        const fct = TemperatureSensorSeeder.generate(
          { slots: [ IntegerInSlotSeeder.generate({ name: slotname }) ] },
        )
        const fctGraph = new FCTGraph({ functionalities: [ fct ] })

        addPushInFctForAllInSlotsWhichHaveNone(fctGraph, { fctData: { source: { name: 'ospin-webapp' } } })

        expect(fctGraph.getSlotByFctIdAndSlotName(fct.id, slotname).inputNodeId)
          .toBe(fctGraph.functionalities[1].id)
        expect(fctGraph.functionalities[1].type).toBe('InputNode')
      })

    })

    describe('without a reporter fct', () => {
      it('should return null', () => {
        const slotname = 'value'
        const fct = TemperatureSensorSeeder.generate(
          { slots: [ IntegerInSlotSeeder.generate({ name: slotname }) ] },
        )
        const fctGraph = new FCTGraph({ functionalities: [ fct ] })

        expect(fctGraph.getSlotByFctIdAndSlotName(fct.id, slotname).inputNodeId)
          .toBeNull()
      })

    })

  })
})
