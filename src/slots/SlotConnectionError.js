class SlotConnectionError extends Error {

  static get NAME() { return 'SlotConnectionError' }

  constructor(slotA, slotB, msg, ...params) {
    super(...params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SlotConnectionError)
    }

    this.name = SlotConnectionError.NAME
    this.message = `${msg}:\n${slotA}\n${slotB}`
  }

}

module.exports = SlotConnectionError
