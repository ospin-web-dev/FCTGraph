const util = require('util')
const Joi = require('joi')
const diff = require('deep-diff')

const ObjUtils = require('../../utils/ObjUtils')

/* JOIous is there for YOU
 *
 * JOIous is doing a few kind things for us related to data validation
 * and serialization to/from JSON for instances
 *
 * on assertValidDataAndNew, JOIous asserts the dataprovided
 * against the Class' joi SCHEMA and instantiates down from there
 * without assertion
 *
 * on toJSON (aka what JSON.stringify calls) it will sort by key
 *
 * JOIous receivers need the following:
 * - a Class.SCHEMA method which returns a JOI schema
 * - a .serialize method which returns a plain old js object
 */

const JOIous = ReceivingClass => class extends ReceivingClass {

  static get name() { return ReceivingClass.name }

  static get isJOIous() { return true }

  static deepEquals(instanceA, instanceB) {
    return ObjUtils.objsDeepEqual(instanceA.serialize(), instanceB.serialize())
  }

  static enrichJoiValidationError(error) {
    // eslint-disable-next-line
    error.message = `JOI error in ${this.name}:\n\n${error.annotate()}`
  }

  static assertValidData(data) {
    if (!this.SCHEMA) {
      throw new Error(`${this.name} requires a static .SCHEMA method`)
    }

    try {
      Joi.attempt(data, this.SCHEMA)
    } catch (e) {
      if (e.isJoi) { this.enrichJoiValidationError(e) }
      throw e
    }
  }

  static assertValidDataAndNew(data) {
    /* here, 'this' is a reference to the class that composes JOIous
     * So if the ReceivingClass is FCTGraph, 'this' is the FCTGraph.
     * This enables us to call the constructor from the static
     * method without naming the class. */
    this.assertValidData(data)

    return new this(data)
  }

  clone() {
    const data = this.serialize()
    return new this.constructor(data)
  }

  static enrichBadSerializedInstanceData(error) {
    // eslint-disable-next-line
    error.message = 'The instance serialized with invalid data:\n\n' + error.message
  }

  serialize() {
    // This super looks backwards because JOIous is composed in to classes
    // in this case it anonymously extends the base class it is composed in to
    if (!super.serialize) {
      throw new Error(`${this.constructor.name} requires a .serialize method`)
    }

    return super.serialize()
  }

  serializeAndAssert() {
    const serializedData = this.serialize()

    try {
      this.constructor.assertValidData(serializedData)
    } catch (e) {
      this.constructor.enrichBadSerializedInstanceData(e)
      throw e
    }

    return serializedData
  }

  sortAndSerialize() {
    return ObjUtils.sortByKeys(this.serialize())
  }

  sortAndSerializeAndAssert() {
    return ObjUtils.sortByKeys(this.serializeAndAssert())
  }

  toJSON() {
    return this.sortAndSerialize()
  }

  // deeper print outs (believe this won't work in Node, but should in most browsers)
  toString() {
    return util.inspect(this, { compact: false, depth: 6 })
  }

}

module.exports = JOIous
