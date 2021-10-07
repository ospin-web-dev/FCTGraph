const util = require('util')

class AddSlotError extends Error {

  static get NAME() { return 'AddSlotError' }

  constructor(slotData, msg, ...params) {
    super(...params)

    this.name = AddSlotError.NAME
    const richSlotDisplay = util.inspect(slotData, { compact: false, depth: 4 })
    this.message = `Failed to add slot: ${richSlotDisplay}\n\n${msg}`
  }

}

module.exports = AddSlotError
