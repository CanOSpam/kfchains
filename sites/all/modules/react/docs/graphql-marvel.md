## Marvel in GraphQL

### Helper 

#### `src/helper/DrupalApi.js`

```
# Each Model is imported from the type definition
import {
  Model as Character
} from '../types/character'
```

```
# DrupalApi class is instantiated 
class DrupalApi {

# Constructor is used to store the config settings from the .env file and set both the OAuth tokens and headers 
  constructor() {
    this.fetch = fetchWithConfig({
      host: process.env.DRUPAL_URL,
      headers: [
        ['Accept', 'application/vnd.api+json'],
        ['Content-Type', 'application/vnd.api+json']
      ],
      tokenConfig: {
        grant_type: 'password',
        client_id: process.env.CLIENT_ID,
        ............
```

```
 # The async function 'characters' returns a promise to be resolved for the initial list from Drupal
  async characters(nid = null) {
    const response = await this.fetch('/jsonapi/node/marvel_characters')
    const { data } = await response.json()
    ............
```

```
  # The async function 'createCharacter' returns a promise post a new Character back into Drupal
  async createCharacter(character) {
    const body = JSON.stringify({
      data: {
        type: 'node--marvel_characters',
        attributes: character
      }
    })
    const response = await this.fetch('/jsonapi/node/marvel_characters', {
      method: 'POST',
      body
    })
    ............
  }
```


#### `src/helper/MarvelApi.js`

```
# Each Model is imported from the type definition
import { Model as Comic } from '../types/comic'
import { Model as Character } from '../types/character'
```

```
# DrupalApi class is instantiated 
class MarvelApi {

  # Constructor is used to store the config settings from the .env file and set both hash and headers 
  constructor() {
    const privateKey = process.env.API_PRIVATE_KEY;
    const publicKey = process.env.API_PUBLIC_KEY;
    const ts = Date.now();
    const hash = crypto.createHash('md5').update(`${ts}${privateKey}${publicKey}`).digest('hex');
    ............
```

```
  # 'characters' function uses a 'fetch' to pull the character by name (based on user input) per the Marvel API
  characters(name = null) {
    let params = this.params + '&limit=100'
    if (!!name) {
      params += `&name=${name}`
    }
    ............
    const url = `${this.url}/characters?${params}`;
    return fetch(url)
      .then(res => res.json())
    ............
```

```
  # 'comics' function uses a 'fetch' comics with the character ID per the Marvel API
  comics(id) {
    const url = `${this.url}/characters/${id}/comics?${this.params}`;
    return fetch(url)
      .then(res => res.json())
      .then(json => json.data.results.map(i => new Comic(i)))
      ............
```

#### `src/helper/ComicSalesApi.js`

```
# DrupalApi class is instantiated 
class ComicSalesApi {
  # Constructor then stores the external endpoint for the comic sales api 
  constructor() {
    this.url = 'https://comichron-data.github.io'
    ..............
```

```
  # 'fetchById' function uses a 'fetch' to pull sales data by comic title 
  fetchById(id) {
    return fetch(`${this.url}/api/titles/${id}/by-issue.json`)
      .then(res => res.json())
      ..............
  }
```


### Types

#### `src/types/character.js`

```
# API helper functions imported 
import { api as MarvelApi } from '../helper/MarvelApi';
import { api as DrupalApi } from '../helper/DrupalApi'

# Additional type definitions are also imported
import comics from './comic';
```

```
# Schema is defined according to field for 'Character', while 'CharacterName' is defined by user input 
const schema = `
  type Character @cacheControl(maxAge: 240) {
    id: ID!
    name: String!
    image: String
    ............
  }
  input CharacterName {
    name: String
  }
`;
```

```
# Queries are declared by listing and individual selection by ID
const queries = `
  characters: [Character]
  character(id: ID!): Character
`;
```

```
# Mutations are declared for updating or creating characters by name
const mutations = `
  updateCharacter(id: Int! input:CharacterName!): Character
  createCharacter(input:CharacterName!): Character
`
```

```
# Resolvers are then defined for each of the functional purposes
const characters = () => DrupalApi.characters()
const character = (_, { id }) => DrupalApi.characters(id)
const updateCharacter = (_, { id, input }) => {
  ...........
const createCharacter = (_, { input }) => {
```

```
# The Model is then exported matching the field assignments
export class Model {
  constructor({ id, attributes }) {
    this.id = id
    this.name = attributes.title
    ...........
```


#### `src/types/marvel.js`



```
# Helper function is imported for execution 
import { api as MarvelApi } from '../helper/MarvelApi'
```

```
# Local file is imported for the typeahead functionality when typing names
import characters from '../../data/characters.json'
```


```
# Schema is defined according to field
const schema = `
  type Marvel @cacheControl(maxAge: 240) {
    id: Int!
    name: String!
  ...........
```

```
# The query is then defined to be imported later 
const queries = `
  marvel: [Marvel]
`
```

#### `src/types/comic.js`

```
# Helper function is imported for execution 
import { api as ComicSalesApi } from '../helper/ComicSalesApi'
```

```
# Local file is imported for the typeahead functionality when typing names
import characters from '../../data/characters.json'
```

```
# Schema is defined according to field
const schema = `
  type Comic @cacheControl(maxAge: 30) {
    id: ID!
    title: String!
    issueNumber: Int
    ...........
```

```
# The Model is then declared with the constructor importing the referenced object  
export class Model {
  constructor({ id, title, issueNumber, description, thumbnail }) {
    this.id = id;
    this.title = title;
    ........... 
```

#### `src/types/comicSale.js`

```
# Schema is defined according to issue and sales count 
const schema = `
  type ComicSale @cacheControl(maxAge: 30) {
    issue: Int!
    count: Int!
  }
`
```


### Schemas 

#### `src/schema.js`

```
# Each of the types are imported 
import characters from './types/character'
import comics from './types/comic'
import comicSale from './types/comicSale'
import marvel from './types/marvel'
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
