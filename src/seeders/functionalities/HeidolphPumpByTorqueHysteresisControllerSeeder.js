const ControllerSeeder = require('./ControllerSeeder')
const {
  FloatInSlotSeeder,
  FloatOutSlotSeeder,
  BooleanInSlotSeeder,
} = require('../slots')
const HeidolphPumpByTorqueHysteresisController = require('../../functionalities/HeidolphPumpByTorqueHysteresisController')

class HeidolphPumpByTorqueHysteresisControllerSeeder extends ControllerSeeder {

  static generateSlots() {
    return [
      BooleanInSlotSeeder.generate({ name: 'enable' }),
      FloatInSlotSeeder.generate({ name: 'output value when on', unit: 'rpm' }),
      FloatInSlotSeeder.generate({ name: 'output value when off', unit: 'rpm' }),
      FloatInSlotSeeder.generate({ name: 'lower limit', unit: 'Ncm' }),
      FloatInSlotSeeder.generate({ name: 'upper limit', unit: 'Ncm' }),
      FloatInSlotSeeder.generate({ name: 'torque', unit: 'Ncm' }),
      FloatOutSlotSeeder.generate({ name: 'output value', unit: 'rpm' }),
    ]
  }

  static generate(overrideData = {}) {
    return {
      ...super.generate(overrideData),
      subType: HeidolphPumpByTorqueHysteresisController.SUB_TYPE,
      slots: this.generateSlots(),
      ...overrideData,
    }
  }

}

module.exports = HeidolphPumpByTorqueHysteresisControllerSeeder
