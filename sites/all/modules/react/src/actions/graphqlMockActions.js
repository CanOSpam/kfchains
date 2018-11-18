import gql from 'graphql-tag'

import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

export const MOCK_GRAPHQL_BEGIN = 'MOCK_GRAPHQL_BEGIN'
export const MOCK_GRAPHQL_END = 'MOCK_GRAPHQL_END'
export const MOCK_GRAPQHL_MSG = 'MOCK_GRAPQHL_MSG'

const client = new ApolloClient({
  link: new HttpLink({uri: 'http://localhost:8082/graphql'}),
  cache: new InMemoryCache()
})

const fetchAll = () => {
  return gql`
    query {
      users {
        name
        email
        first_name
        last_name
        email
        country
        id
      }
    }
  `
}

const endAction = (data) => {
  return { type: MOCK_GRAPHQL_END, data: data }
}

export const fetchUsersAction = () => {
  return dispatch => {
    const query = fetchAll()
    return client.query({ query })
      .then(data => {
        const { data: { users }} = data
        dispatch(endAction(users))
      })
  }
}
