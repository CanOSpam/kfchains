/**
 * @file
 * Define the user schema object for our server.
 */

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

const queries = `
  users: [User]
  user(id: ID!): Character
`

export default () => ({ schema, queries })
