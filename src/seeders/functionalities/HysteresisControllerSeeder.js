const ControllerSeeder = require('./ControllerSeeder')
const {
  FloatInSlotSeeder,
  FloatOutSlotSeeder,
  BooleanInSlotSeeder,
} = require('../slots')
const HysteresisController = require('../../functionalities/HysteresisController')

class HysteresisControllerSeeder extends ControllerSeeder {

  static generateSlots() {
    return [
      BooleanInSlotSeeder.generate({ name: 'enable' }),
      FloatInSlotSeeder.generate({ name: 'output value when on' }),
      FloatInSlotSeeder.generate({ name: 'output value when off' }),
      FloatInSlotSeeder.generate({ name: 'lower limit' }),
      FloatInSlotSeeder.generate({ name: 'upper limit' }),
      FloatOutSlotSeeder.generate({ name: 'output value' }),
    ]
  }

  static generate(overrideData = {}) {
    return {
      ...super.generate(overrideData),
      subType: HysteresisController.SUB_TYPE,
      slots: this.generateSlots(),
      ...overrideData,
    }
  }

}

module.exports = HysteresisControllerSeeder
