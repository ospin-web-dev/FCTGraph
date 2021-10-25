const IntervalOut = require('functionalities/IntervalOut')
const IntervalOutSeeder = require('seeders/functionalities/IntervalOutSeeder')
const {
  TemperatureSensorSeeder,
  PushOutSeeder,
} = require('seeders/functionalities')
const {
  FloatOutSlotSeeder,
  FloatInSlotSeeder,
} = require('seeders/slots')

describe('the IntervalOut class', () => {

  describe('.constructor', () => {
    describe('re: assigning default values', () => {
      it('assigns `publishIntervalMs` to the default if none is provided', () => {
        const intervalOutData = IntervalOutSeeder.generate()
        delete intervalOutData.publishIntervalMs

        const intervalOut = new IntervalOut(intervalOutData)

        expect(intervalOut.publishIntervalMs).toStrictEqual(
          IntervalOut.DEFAULT_PUBLISH_INTERVAL,
        )
      })
    })
  })

  describe('.newAndAssertStructure', () => {
    it('will not accept 0 or a negative value as a publishIntervalMs', () => {
      const invalidVals = [ 0, -1, -1000 ]
      const intervalOutData = IntervalOutSeeder.generate({})

      for (const val of invalidVals) { // eslint-disable-line
        expect(() => {
          intervalOutData.publishIntervalMs = val
          IntervalOut.newAndAssertStructure(intervalOutData)
        }).toThrow(/"publishIntervalMs" must be greater than or equal to/)
      }
    })
  })

  describe('.serialize', () => {
    it('serializes with the publishIntervalMs included', () => {
      const publishIntervalMs = 100
      const intervalOutData = IntervalOutSeeder.generate({ publishIntervalMs })

      const intervalOut = new IntervalOut(intervalOutData)

      expect(intervalOut.serialize().publishIntervalMs).toStrictEqual(publishIntervalMs)
    })
  })
})
