class SetProtectedPropertyError extends Error {

  static get NAME() { return 'SetProtectedPropertyError' }

  constructor(obj, propertyName, attemptedValue, ...params) {
    super(...params)

    this.name = SetProtectedPropertyError.NAME
    this.message = `\nCan not set protected property on fct ${obj.name}: ${propertyName}\nCurrent property value: ${obj[propertyName]}\nAttempted to set: ${attemptedValue}`
  }

}

module.exports = SetProtectedPropertyError
