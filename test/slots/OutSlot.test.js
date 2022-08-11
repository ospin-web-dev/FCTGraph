const {
  IntegerOutSlotSeeder,
} = require('seeders/slots')
const {
  TemperatureSensorSeeder,
} = require('seeders/functionalities')

const FCTGraph = require('fctGraph/FCTGraph')
const { mutators: { addIntervalOutFctForAllOutSlotsWhichHaveNone } } = require('fctGraph/Utils')

describe('outslot', () => {

  describe('getReporterFctId', () => {
    describe('with a reporter fct', () => {

      it('should return the reporter fct id', () => {
        const slotname = 'target'
        const fct = TemperatureSensorSeeder.generate(
          { slots: [ IntegerOutSlotSeeder.generate({ name: slotname }) ] },
        )
        const fctGraph = new FCTGraph({ functionalities: [ fct ] })

        addIntervalOutFctForAllOutSlotsWhichHaveNone(fctGraph)

        expect(fctGraph.getSlotByFctIdAndSlotName(fct.id, slotname).reporterFctId)
          .toBe(fctGraph.functionalities[1].id)
        expect(fctGraph.functionalities[1].type).toBe('OutputNode')
      })

    })

    describe('without a reporter fct', () => {
      it('should return null', () => {
        const slotname = 'target'
        const fct = TemperatureSensorSeeder.generate(
          { slots: [ IntegerOutSlotSeeder.generate({ name: slotname }) ] },
        )
        const fctGraph = new FCTGraph({ functionalities: [ fct ] })

        expect(fctGraph.getSlotByFctIdAndSlotName(fct.id, slotname).reporterFctId)
          .toBeNull()
      })

    })

  })
})
