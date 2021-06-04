const ControllerSeeder = require('test/seeders/functionalities/ControllerSeeder')
const { InSlotSeeder, OutSlotSeeder } = require('test/seeders/slots')
const PIDController = require('functionalities/PIDController')

class PIDControllerSeeder extends ControllerSeeder {

  static get SLOT_SEEDS() {
    return [
      InSlotSeeder.generate({ name: 'P', dataType: 'float' }),
      InSlotSeeder.generate({ name: 'I', dataType: 'float' }),
      InSlotSeeder.generate({ name: 'D', dataType: 'float' }),
      InSlotSeeder.generate({ name: 'target in', dataType: 'float' }),
      InSlotSeeder.generate({ name: 'value in', dataType: 'float' }),
      OutSlotSeeder.generate({ name: 'value out', dataType: 'float' }),
    ]
  }

  static generate(data) {
    return {
      ...super.generate(data),
      subType: PIDController.SUB_TYPE,
      slots: [ ...this.SLOT_SEEDS ],
      ...data,
    }
  }

}

module.exports = PIDControllerSeeder
