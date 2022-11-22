const Ports = require('../../src/functionalities/Ports')

describe('Ports', () => {
  describe('getId', () => {
    describe('for a ports array without a unitId on the port', () => {
      it('returns just the name', () => {
        const ports = [{ name: 'Serial 1', purpose: 'test' }]

        const res = Ports.getId(ports)

        expect(res).toBe(ports[0].name)
      })
    })

    describe('for a ports array with a unitId on the port', () => {
      it('returns the name and the unitId', () => {
        const ports = [{ name: 'Serial 1', purpose: 'test', unitId: '42' }]

        const res = Ports.getId(ports)

        expect(res).toBe(`${ports[0].name}-${ports[0].unitId}`)
      })
    })
  })

  describe('areEqual', () => {
    describe('when the ports are equal', () => {
      it('returns true', () => {
        const portsA = [{ name: 'Serial 1', purpose: 'test', unitId: '42' }]
        const portsB = [{ name: 'Serial 1', purpose: 'test', unitId: '42' }]

        const res = Ports.areEqual(portsA, portsB)

        expect(res).toBe(true)
      })
    })

    describe('when the ports are NOT equal', () => {
      it('returns false', () => {
        const portsA = [{ name: 'Serial 1', purpose: 'test', unitId: '42' }]
        const portsB = [{ name: 'Serial 1', purpose: 'test', unitId: '41' }]

        const res = Ports.areEqual(portsA, portsB)

        expect(res).toBe(false)
      })
    })
  })

  describe('areDifferent', () => {
    describe('when the ports are equal', () => {
      it('returns false', () => {
        const portsA = [{ name: 'Serial 1', purpose: 'test', unitId: '42' }]
        const portsB = [{ name: 'Serial 1', purpose: 'test', unitId: '42' }]

        const res = Ports.areDifferent(portsA, portsB)

        expect(res).toBe(false)
      })
    })

    describe('when the ports are NOT equal', () => {
      it('returns true', () => {
        const portsA = [{ name: 'Serial 1', purpose: 'test', unitId: '42' }]
        const portsB = [{ name: 'Serial 1', purpose: 'test', unitId: '41' }]

        const res = Ports.areDifferent(portsA, portsB)

        expect(res).toBe(true)
      })
    })
  })
})
