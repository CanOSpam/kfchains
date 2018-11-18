import { api as MarvelApi } from '../helper/MarvelApi';
import { api as DrupalApi } from '../helper/DrupalApi'

// Additional Type definitions that are used by this module.
import comics from './comic';

/**
 * --- Schema definition for the type ---
 *
 * @see http://graphql.org/learn/schema/#type-language
 *
 * This is written using the graphql syntax, the schema definition exists inside
 * the backtick block. This defines fields that can be queried for when using
 * one of the defined graphql query handlers.
 *
 * Example:
 * {
 *    character(id: 1) {
 *      id
 *      name
 *      comics {
 *         title
 *      }
 *    }
 * }
 *
 * Any fields that reference a complex GraphQL type can define resolvers that
 * assist in presenting this information. When using complex types it extends
 * the querability of fields for the given type.
 */
const schema = `
  type Character @cacheControl(maxAge: 240) {
    id: ID!
    name: String!
    image: String
    description: String
    marvelId: Int
    comics: [Comic] @cacheControl(maxAge: 240)
  }

  input CharacterName {
    name: String
  }
`;

/**
 * --- GraphQL query defintions ---
 *
 * @see http://graphql.org/learn/queries/
 * We define ways that we can query for the type defined above here. Typically
 * we will define a single resource accoess (character) and a bundled access (characters)
 * and we define the reponse type so GraphQL knows what data it sends back.
 *
 * Return types can be wrapped in array identifiers to indicate an array of the
 * types will be returned.
 */
const queries = `
  characters: [Character]
  character(id: ID!): Character
`;


/**
 * --- GraphQL mutation definitions ---
 *
 * @see http://graphql.org/learn/queries/#mutations
 * Mutations allow the GraphQL server to update the data exposed by the query
 * accessors. Mutations follow similar syntax to queries and allow you to define
 * what input will be sent to the resolver so that you can write the method for
 * updateing the content.
 */
const mutations = `
  updateCharacter(id: Int! input:CharacterName!): Character
  createCharacter(input:CharacterName!): Character
`

/**
 * --- RESOLVERS ---
 *
 * Resolvers are functions that will be called when a query or mutation is
 * received by the GraphQL server. The function signature is given 2 paramters;
 * the graphql context and the input and needs to return a data object that
 * matches the expected return type (if your query returns an array then the
 * resolver needs to match). There is one exception in that your resolvers can
 * return a promise, if it does - the GraphQL server will resolve these and use
 * the return value when delivering a response.
 *
 * These methods need to be assigned to the resolver object under the correct
 * key for the GraphQL server to have access to them.
 */

const characters = () => DrupalApi.characters()

const character = (_, { id }) => DrupalApi.characters(id)

const updateCharacter = (_, { id, input }) => {
  const _character = character(_, { id })
  const { name } = input

  if (!_character) {
    throw new Error(`Couldn't find a character with an id of ${id}`)
  }

  _character.name = name
  return _character
}

const createCharacter = (_, { input }) => {
  const { name } = input;

  return MarvelApi.characters(name).then(json => {
    if (json.data.count === 0) {
      throw new Error(`${name} could not be entered`)
    }

    const character = json.data.results[0]

    const characterData = {
      title: character.name,
      field_description: {
        value: character.description,
        format: 'rich_text'
      },
      field_image_reference: `${character.thumbnail.path}.${character.thumbnail.extension}`,
      field_marvel_id: character.id,
    }

    return DrupalApi.createCharacter(characterData)
  })
}
/** --- **/

const resolvers = {
  queries: {
    // Object shorthand is used to assign our query handlers, in the graphql
    // query definition above we defined `characters` and `character`. For graphql to
    // properly resolve these, the queries property needs to contain properties
    // that match- characters: function() {} and character: function() {}.
    characters,
    character
  },
  mutations: {
    // As with queries defined mutations need to follow the same rules when
    // defining the mutations.
    updateCharacter,
    createCharacter
  },

  /*
  When the defined type uses complex return types we can define additional field
  resolvers here. These callbakcs are given the current resource, this then
  allows the resolvers to look up information (either DB or API) and format the
  response in a way that the type definition expects.

  As with query and mutation resolvers these resolvers must return a result that
  is expected by the definition (or a promise that will resolve to the expected
  return type).
  */
  Character: {
    comics: ({ marvelId }) => MarvelApi.comics(marvelId)
  }
}

/**
 * --- CLASS MODEL ---
 *
 * A model can be used to massage the data received from a remote source (db,
 * api, etc.) into the schema known by GraphQL.
 */
export class Model {
  constructor({ id, attributes }) {
    this.id = id
    this.name = attributes.title
    this.description = attributes.field_description !== null ? attributes.field_description.value : ''
    this.image = attributes.field_image_reference
    this.nid = attributes.nid
    this.comics = []
    this.marvelId = attributes.field_marvel_id
  }
}
/** ---- */

/**
 * --- graphql-tools expected return values ---
 * The graphql-tools package requires the module to return an object that
 * defines the schema, queries, mutations and resolvers. These will be merged
 * into the GraphQL root object automatically after the module has been imported
 * into schema.js.
 *
 * The modules array ensures that your dependent types are exported to the root
 * object.
 *
 * Expected export:
 * {
 *   schema: {GraphQL string},
 *   queries: {GraphQL string},
 *   mutations: {GraphQL string},
 *   resolves: {object},
 *   modules: [array]
 * }
 */
export default () => ({
  schema,
  queries,
  mutations,
  resolvers,
  modules: [comics]
})
