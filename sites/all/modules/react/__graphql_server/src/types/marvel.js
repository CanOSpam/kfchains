/**
 * @file
 * Marvel API Graphql type.
 *
 * This graphql type will fetch a number of results from the marvel api so
 * that it can be used in the multi-endpoint lookahead.
 */

import { api as MarvelApi } from '../helper/MarvelApi'

import characters from '../../data/characters.json'

/**
 * --- Schema definition ---
 */
const schema = `
  type Marvel @cacheControl(maxAge: 240) {
    id: Int!
    name: String!
  }
`

/**
 * --- Query defintion ---
 */
const queries = `
  marvel: [Marvel]
`

/**
 * @function Marvel
 *
 * Defines how to resolve the Marvel query. This will make a request to the
 * marvel API and fetch a list of characters - the request is limited to
 * 100 as per the API requirements and as demonstration this will show
 * enough characters.
 */
const marvel = () => characters

/**
 * --- Resolvers ---
 * Map the query resolver to the query schema.
 */
const resolvers = {
  queries: {
    marvel
  }
}

export default () => ({
  schema,
  queries,
  resolvers
})
