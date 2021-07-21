const { Functionality } = require('functionalities')
const TemperatureSensorSeeder = require('seeders/functionalities/TemperatureSensorSeeder')
const {
  FloatInSlotSeeder,
  IntegerInSlotSeeder,
} = require('seeders/slots')

describe('the Functionality class', () => {

  describe('.constructor', () => {
    describe('re: assigning default values', () => {
      it('assigns `isVirtual` to false', () => {
        const functionalityData = TemperatureSensorSeeder.generate()
        delete functionalityData.isVirtual

        const functionality = new Functionality(functionalityData)

        expect(functionality.isVirtual).toBe(false)
      })
    })

    describe('when creating its slots', () => {
      it('will throw error if given slots data containing duplicate data', () => {
        const DUPLICATE_NAME = 'jabrone'
        const UNIQUE_NAME = 'frank reynolds'
        const slotA = FloatInSlotSeeder.generate({ name: DUPLICATE_NAME })
        const slotB = IntegerInSlotSeeder.generate({ name: UNIQUE_NAME })
        const slotC = IntegerInSlotSeeder.generate({ name: DUPLICATE_NAME })

        const fctData = TemperatureSensorSeeder.generate({ slots: [ slotA, slotB, slotC ] })

        expect(() => new Functionality(fctData)).toThrow(
          /already has a slot with the same name/,
        )
      })
    })
  })

  describe('.isPhysical', () => {
    it('returns the inverse of .isVirtual', () => {
      const virtualSensor = TemperatureSensorSeeder.seedOne({ isVirtual: true })
      expect(virtualSensor.isVirtual).toBe(true)

      const physicalSensor = TemperatureSensorSeeder.seedOne({ isVirtual: false })
      expect(physicalSensor.isVirtual).toBe(false)

      expect(virtualSensor.isPhysical).toBe(!virtualSensor.isVirtual)
      expect(physicalSensor.isPhysical).toBe(!physicalSensor.isVirtual)
    })
  })

})
