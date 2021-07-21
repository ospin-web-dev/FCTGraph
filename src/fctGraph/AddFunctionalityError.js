const util = require('util')

class AddFunctionalityError extends Error {

  static get NAME() { return 'AddFunctionalityError' }

  constructor(fctData, msg, ...params) {
    super(...params)

    this.name = AddFunctionalityError.NAME
    const richFctDisplay = util.inspect(fctData, { compact: false, depth: 4 })
    this.message = `Failed to add fct: ${richFctDisplay}\n\n${msg}`
  }

}

module.exports = AddFunctionalityError
