const FCTGraphSeeder = require('seeders/fctGraph/FCTGraphSeeder')
const {
  TemperatureSensorSeeder,
  HeaterActuatorSeeder,
  PIDControllerSeeder,
  PushOutSeeder,
  IntervalOutSeeder,
  PushInSeeder,
} = require('seeders/functionalities')
const fctGraphsAreSameWIthoutIONodes = require('fctGraph/Utils/predicates/fctGraphsAreSameWIthoutIONodes')

describe('fctGraphsAreSameWithoutIONodes', () => {
  const fctGraph1 = FCTGraphSeeder
    .seedOne({ functionalities: [
      PushInSeeder.generate(),
      IntervalOutSeeder.generate(),
      HeaterActuatorSeeder.generate(),
    ] })

  const fctGraph2 = FCTGraphSeeder
    .seedOne({ functionalities: [
      TemperatureSensorSeeder.generate(),
      PIDControllerSeeder.generate(),
      PushOutSeeder.generate(),
    ] })

  describe('with invalid parameters', () => {

    describe('when the first parameter is not an fctGraph', () => {
      it('should throw an error', () => {
        expect(
          () => fctGraphsAreSameWIthoutIONodes('Not an FctGraph', fctGraph1),
        ).toThrow('When using , the first argument must be an instance of fctGraph.')
      })
    })

    describe('when the 2nd parameter is not an fctGraph', () => {
      it('should throw an error', () => {
        expect(
          () => fctGraphsAreSameWIthoutIONodes(fctGraph1, 'Not an FctGraph'),
        ).toThrow('When using , the first argument must be an instance of fctGraph.')
      })
    })
  })

  describe('with valid parameters', () => {

    describe('when given the same fctGraph twice', () => {
      it('should return true', () => {
        expect(fctGraphsAreSameWIthoutIONodes(fctGraph1, fctGraph1)).toBe(true)
      })
    })

    describe('when given 2 graphs that only differ in IO nodes', () => {
      it('should return true', () => {
        const fctGraph3 = fctGraph1.clone()
        fctGraph3.addFunctionalityByData(PushOutSeeder.generate())
        expect(fctGraph1.functionalities).not.toHaveLength(fctGraph3.functionalities.length)
        expect(fctGraphsAreSameWIthoutIONodes(fctGraph1, fctGraph3)).toBe(true)
        expect(fctGraphsAreSameWIthoutIONodes(fctGraph3, fctGraph1)).toBe(true)

      })
    })

    describe('when given different fctGraphs', () => {
      it('should return false', () => {
        expect(fctGraphsAreSameWIthoutIONodes(fctGraph1, fctGraph2)).toBe(false)
        expect(fctGraphsAreSameWIthoutIONodes(fctGraph2, fctGraph1)).toBe(false)

      })
    })
  })
})
