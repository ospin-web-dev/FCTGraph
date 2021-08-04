const OutputNode = require('functionalities/OutputNode')
const OutputNodeSeeder = require('seeders/functionalities/OutputNodeSeeder')

describe('the OutputNode virtual class', () => {

  describe('.constructor', () => {
    describe('re: assigning default values', () => {
      it('assigns `destination` to the class default if none is provided', () => {
        const outputNodeData = OutputNodeSeeder.generate()
        delete outputNodeData.destination

        const outputNode = new OutputNode(outputNodeData)

        expect(outputNode.destination).toStrictEqual(
          OutputNode.DEFAULT_DESTINATION,
        )
      })
    })
  })

  describe('.serialize', () => {
    it('serializes with the destination included', () => {
      const destination = { name: 'bauer sucht frau' }
      const outputNodeData = OutputNodeSeeder.generate({ destination })

      const outputNode = new OutputNode(outputNodeData)

      expect(outputNode.serialize().destination).toStrictEqual(destination)
    })
  })

  describe('get .isOutputNode', () => {
    it('returns true if the fct is indeed an OutputNode', () => {
      const outputNodeData = OutputNodeSeeder.generate()
      const outputNode = new OutputNode(outputNodeData)

      expect(outputNode.isOutputNode).toBe(true)
    })
  })
})
