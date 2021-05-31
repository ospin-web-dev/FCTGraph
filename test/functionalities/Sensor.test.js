const TemperatureSensor = require('../../src/functionalities/TemperatureSensor')

const { FunctionalitySeeder } = require('../seeders')

describe('class TemperatureSensor', () => {

  it('is JOIous', () => {
    expect(TemperatureSensor.isJOIous).toBe(true)
  })

  describe('new', () => {
    it('throws if given an invalid data object', () => {
      expect(() => new TemperatureSensor({ slots: [] })).toThrow('is required')
    })

    it.only('creates an object successfully when given valid data', () => {

      const tempSensorData = FunctionalitySeeder.generate()
      console.log(1, { tempSensorData })
      console.log(tempSensorData.slots[0])
      const tempSensor = new TemperatureSensor(tempSensorData)
    })
  })
})
