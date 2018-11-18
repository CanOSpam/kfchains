import { bundle } from 'graphql-modules'
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'

/**
 * --- Schema types ---
 * Import our defined schemas so that we can bundle them together with the
 * graphql-modules package. This will keep complex schemas managable as
 * each type will be managed by a discrete file.
 *
 * @see ./types/character for more inforamtion
 */
import characters from './types/character'
import comics from './types/comic'
import users from './types/user'
import pokemon from './types/pokemon'
import abilities from './types/pokemon_ability'
import types from './types/pokemon_types'
import comicSale from './types/comicSale'
import marvel from './types/marvel'
/* --- end Schema types --- */

import mocks from './mocks'

// Add the exported modules to the modules array ready for bundling.
const modules = [characters, comics, users, pokemon, abilities, types, comicSale, marvel]

const schema = makeExecutableSchema(bundle(modules))

if (process.env.MOCK && process.env.MOCK === 'true') {
  /**
   * This function from graphql-tools provides schema mocking for all defined
   * schemas. If you have complex modules you can defined custom mock objects
   * in `./mocks.js`.
   *
   * @see https://www.apollographql.com/docs/graphql-tools/mocking.html
   */
  addMockFunctionsToSchema({
    schema,
    mocks,
    preserveResolvers: true
  })
}

export default schema;
