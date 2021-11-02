const {
  TemperatureSensorSeeder,
  HeaterActuatorSeeder,
  PIDControllerSeeder,
  IntervalOutSeeder,
  PushInSeeder,
} = require('seeders/functionalities')
const fctsAreFunctionallyEqual = require('fctGraph/Utils/predicates/fctsAreFunctionallyEqual')

describe('fctsAreFunctionallyEqual', () => {

  function setup() {
    const fctsA = [
      PushInSeeder.seedOne(),
      IntervalOutSeeder.seedOne(),
      HeaterActuatorSeeder.seedOne(),
    ]

    const fctsB = [
      fctsA[2].clone(),
      fctsA[0].clone(),
      fctsA[1].clone(),
    ]

    return { fctsA, fctsB }
  }

  describe('when given 2 arrays of functionalities that should be compatible', () => {
    it('should return true', () => {
      const { fctsA, fctsB } = setup()

      expect(fctsAreFunctionallyEqual(fctsA, fctsB)).toBe(true)
    })
  })

  describe('when given 2 arrays of functionalities with different lengths', () => {
    it('should return false', () => {
      const { fctsA, fctsB } = setup()
      fctsB.push(fctsB[0].clone())

      expect(fctsA).not.toHaveLength(fctsB.length)
      expect(fctsAreFunctionallyEqual(fctsA, fctsB)).toBe(false)
    })
  })

  describe('when given 2 arrays of incompatible functionalities', () => {
    it('should return false', () => {
      const { fctsA, fctsB } = setup()
      fctsA.push(PIDControllerSeeder.seedOne())
      fctsB.push(TemperatureSensorSeeder.seedOne())

      expect(fctsA).toHaveLength(fctsB.length)
      expect(fctsAreFunctionallyEqual(fctsA, fctsB)).toBe(false)
    })
  })

})
