import casual from 'casual'

/**
 * --- Type mocking for GraphQL ---
 * @see https://www.apollographql.com/docs/graphql-tools/mocking.html
 *
 * The mocking API provided by graphql-tools allows us to defined custom type
 * resolvers. These will be used if no resolvers have been defined for the given
 * queries and will return values based on the output.
 *
 * We have added a dev dependency on the casual package which provides an API
 * for generating various random data.
 */
export default {
  User: () => ({
    name: casual.full_name,
    email: casual.email,
    accountNumber: casual.integer,
    first_name: casual.first_name,
    last_name: casual.last_name,
    country: casual.country
  })
}
