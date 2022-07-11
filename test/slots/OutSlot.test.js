
const {
  FloatInSlotSeeder,
  FloatOutSlotSeeder,
  IntegerOutSlotSeeder,
  IntegerInSlotSeeder,
  BooleanOutSlotSeeder,
  BooleanInSlotSeeder,
  OneOfOutSlotSeeder,
  OneOfInSlotSeeder,
  AnyOutSlotSeeder,
  AnyInSlotSeeder,
  RandomSlotSeeder,
} = require('seeders/slots')
const {
  HeaterActuatorSeeder,
  PIDControllerSeeder,
  TemperatureSensorSeeder,
  PushOutSeeder,
} = require('seeders/functionalities')

describe('Outslot', () => {

  describe('getReporterFctId', () => {
    describe.skip('with a reporter fct', () => {

      const slotA = IntegerOutSlotSeeder.generate()

      const fctData = TemperatureSensorSeeder.generate({ slots: [ slotA ] })
      console.log(fctData);
    })

    describe('without a reporter fct', () => {

    });

  });
});
