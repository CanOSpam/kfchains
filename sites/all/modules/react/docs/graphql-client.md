## Client in GraphQL


### Types

#### `src/types/user.js`

```
# Schema is defined according to field for users 
const schema = `
  type User @cacheControl(maxAge: 30) {
    id: ID!
    name: String!
    first_name: String!
    last_name: String!
    email: String!
    country: String!
  }
`
```

```
# Queries are declared by listing and individual selection by ID
const queries = `
  users: [User]
  user(id: ID!): Character
`
```


### Schemas 

#### `src/mock.js`

```
# Casual package is used to create random data for testing
import casual from 'casual'

# The 'graphql-tools' package is used to construct the mock schema 
export default {
  User: () => ({
    name: casual.full_name,
    email: casual.email,
    accountNumber: casual.integer,
    ................
```


#### `src/schema.js`

```
# Each of the types are imported 
import users from './types/user'
```

```
# Each type is bundled as an array using the 'graphql-modules' module and exported as schema. 
const modules = [characters, villains, comics, users, pokemon, abilities, types, comicSale, marvel]
const schema = makeExecutableSchema(bundle(modules));
.......
```

```
# The local .env variable is used to trigger the mock data
if (process.env.MOCK && process.env.MOCK === 'true') {
  ..........
  addMockFunctionsToSchema({
    schema,
    mocks,
    ............
}
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
