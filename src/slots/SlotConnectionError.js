class SlotConnectionError extends Error {

  static get NAME() { return 'SlotConnectionError' }

  constructor(slotA, slotB, msg, ...params) {
    super(...params)

    this.name = SlotConnectionError.NAME
    this.message = `${msg}:\n${slotA}\n${slotB}`
  }

}

module.exports = SlotConnectionError
