const Functionality = require('functionalities/Functionality')
const TemperatureSensorSeeder = require('seeders/functionalities/TemperatureSensorSeeder')
const {
  FloatInSlotSeeder,
  IntegerInSlotSeeder,
} = require('seeders/slots')

describe('the Functionality class', () => {

  describe('.constructor', () => {
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

})
