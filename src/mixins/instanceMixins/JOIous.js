const util = require('util')
const Joi = require('joi')
const diff = require('deep-diff')

const ObjUtils = require('utils/ObjUtils')

/* JOIous is there for YOU
 *
 * JOIous is doing a few kind things for us related to data validation
 * and serialization to/from JSON for instances
 *
 * on constructor, JOIous asserts the result of the .serialize method
 * against the Class' joi SCHEMA
 *
 * on toJSON (aka what JSON.stringify calls) it will sort by key
 *
 * JOIous receivers need the following:
 * - a Class.SCHEMA method which returns a JOI schema
 * - a .serialize method which returns an object
 */

const JOIous = ReceivingClass => class extends ReceivingClass {

  static get name() { return ReceivingClass.name }

  static get isJOIous() { return true }

  static diff(objA, objB) {
    return diff(objA, objB) // library returns undefined for no diffs
  }

  static deepEquals(objA, objB) {
    const objDiff = this.diff(objA, objB)
    return typeof objDiff === 'undefined'
  }

  constructor(...args) {
    super(...args)

    this.assertStructure()
  }

  assertStructure() {
    Joi.attempt(
      this.serialize(),
      ReceivingClass.SCHEMA,
    )
  }

  sortAndSerialize() {
    return ObjUtils.sortByKeys(this.serialize())
  }

  toJSON() {
    return this.sortAndSerialize()
  }

  // force same toString behavior as Node
  toString() {
    util.inspect(this)
  }

  // deeper print outs while running on Node
  [util.inspect.custom]() {
    return util.inspect(this.toJSON(), { compact: false, depth: 4 })
  }

}

module.exports = JOIous
