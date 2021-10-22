/* fctGraphUtils is a collecting place for single purpose specialty
 * functions which act on an fctGraph instance. The first argument
 * of all fctGraphUtil methods should be an fctGraph instance
 *
 * - mutators mutate the passed fctGraph
 *
 * If a helper function is found to be needed by many specialty mutators,
 * it may be a candidate to go right on the fctGraph instance methods
 * instead
 */

const mutators = require('./mutators')
const predicates = require('./predicates')

module.exports = {
  mutators,
  predicates,
}
