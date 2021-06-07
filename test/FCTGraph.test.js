const ObjUtils = require('utils/ObjUtils')
const FCTGraphSeeder = require('test/seeders/FCTGraphSeeder')
const FCTGraph = require('FCTGraph')

describe('the FCTGraph class', () => {

  it('is JOIous', () => {
    expect(FCTGraph.isJOIous).toBe(true)
  })

  describe('#constructor', () => {
    it('throws if given an invalid data object', () => {
      expect(() => {
        new FCTGraph({}) // eslint-disable-line
      }).toThrow('is required')
    })

    it('creates an instance', () => {
      const deviceDefault = true
      const fctGraphData = FCTGraphSeeder.generate({ deviceDefault })
      const fctGraph = new FCTGraph(fctGraphData)

      expect(fctGraph instanceof FCTGraph).toBe(true)
      expect(fctGraph.deviceDefault).toBe(true)
    })
  })

  describe('#deepEquals', () => {
    describe('when the fctGraphs deep equal', () => {
      it('returns true', () => {
        const fctGraphData = FCTGraphSeeder.generate()
        const fctGraphA = new FCTGraph(fctGraphData)
        const fctGraphB = new FCTGraph(fctGraphData)

        const result = FCTGraph.deepEquals(fctGraphA, fctGraphB)
        expect(result).toBe(true)
      })
    })

    describe('when the fctGraphs do not equal', () => {
      it('returns false', () => {
        const fctGraphA = FCTGraphSeeder.seedOne()
        const fctGraphB = FCTGraphSeeder.seedOne()

        const result = FCTGraph.deepEquals(fctGraphA, fctGraphB)
        expect(result).toStrictEqual(false)
      })
    })
  })

  describe('.serialize', () => {
    it('serializes back to the original data object', () => {
      const fctGraphData = FCTGraphSeeder.generate()
      const fctGraph = new FCTGraph(fctGraphData)

      expect(fctGraph.serialize()).toStrictEqual(fctGraphData)
    })
  })

  describe('.toJSON', () => {
    it('returns the expected serialized JSON string', () => {
      const fctGraphData = FCTGraphSeeder.generate()
      const fctGraph = new FCTGraph(fctGraphData)
      const sortedJSONData = JSON.stringify(
        ObjUtils.sortByKeys(fctGraphData),
      )

      expect(JSON.stringify(fctGraph)).toStrictEqual(sortedJSONData)
    })
  })
})
