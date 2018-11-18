## Pokemon in GraphQL

### Helper 

#### `src/helper/PokemonApi.js`

```
# Each Model is imported from the type definition
import {
  Model as Pokemon
.....	
import {
  Model as Ability
.....
import {
  Model as Types
.....
```

```
# PokemonAPI class is instantiated 
class PokemonApi {

# Constructor is used to store the config settings from the .env file and set both the OAuth tokens and headers 
  constructor() {
    this.fetch = fetchWithConfig({
      host: process.env.DRUPAL_URL,
      headers: [
        ['Accept', 'application/vnd.api_json'],
        ['Content-Type', 'application/vnd.api_json']
      ],
      tokenConfig: {
        grant_type: 'password',
        client_id: process.env.CLIENT_ID,
        ............

  # The async function(s) then return a promise to be resolved 
  async pokemons(nid = null) {
    const response = await this.fetch('/jsonapi/node/pokemon')
    const { data } = await response.json()
    return data.map(i => new Pokemon(i))
  }
  ...........
```



### Types

#### `src/types/pokemon.js`

```
# Pokemon API function imported as 'PokemonApi'
import { api as PokemonApi } from '../helper/PokemonApi';
```

```
# Schema is defined according to field, while 'abilities' and 'ref_types' are query references since entity references
const schema = `
  type Pokemon {
    id: ID!
    nid: Int
    .......
    abilities: [Ability]
    ref_types: [Ref_Type]
  }
`;
```

```
# The Model is then exporting matching the field assignments
export class Model {
  constructor({ id, attributes }) {
    this.id = id;
    this.nid = attributes.nid;
    .......
  }
}
```

```
# Both const are referenced from the API helper function 
const pokemons = () => PokemonApi.pokemons();
const pokemon = (_, { nid }) => pokemons().then(json => {
  return json.find(pokemon => pokemon.nid === nid);
});

# Then executed within the matching resolver
const resolvers = {
  queries: {
    pokemons,
    pokemon
  },
  Pokemon: {
    abilities: ({ id }) => PokemonApi.abilities(id),
    ref_types: ({ id }) => PokemonApi.ref_types(id)
  }
}
```

#### `src/types/pokemon_ability.js`

```
# Schema is defined according to taxonomy field
const schema = `
type Ability {
  id: ID!
  type: String
  .....
```

```
# The Model is then exporting matching the field assignments
export class Model {
  constructor({ id, type, attributes }) {
    this.id = id;
    this.type = type;
    .....
```

#### `src/types/pokemon_types.js`

```
# Schema is defined according to taxonomy field
const schema = `
type Ref_Type {
  id: ID!
  type: String
  .....
```

```
# The Model is then exporting matching the field assignments
export class Model {
  constructor({ id, type, attributes }) {
    this.id = id;
    this.type = type;
    .....
```

### Schemas 

#### `src/schema.js`

```
# Each of the types are imported 
import pokemon from './types/pokemon'
import abilities from './types/pokemon_ability'
import types from './types/pokemon_types'
```

```
# Each type is bundled as an array using the 'graphql-modules' module and exported as schema. 
const modules = [characters, villains, comics, users, pokemon, abilities, types, comicSale, marvel]
const schema = makeExecutableSchema(bundle(modules));
.......
export default schema;
```

### Execution in Node.js

#### `src/app.js`

```
# The 'schema' is then imported and routed using 'graphqlExpress' after execution of the 'apollo-engine' middleware 
const engine = new Engine({engineConfig: {
  apiKey: process.env.APOLLO_ENGINE,
  stores: [{
    "name": "publicResponseCache",
    ........
app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema,
  tracing: true,
  context: {},
  cacheControl: true
}));
```
