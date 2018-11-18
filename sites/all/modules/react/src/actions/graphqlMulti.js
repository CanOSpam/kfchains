import gql from 'graphql-tag'

import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

export const BEGIN_GRAPHQL_MULTI = 'BEGIN_GRAPHQL_MULTI'
export const END_GRAPHQL_MULTI = 'END_GRAPHQL_MULTI'
export const UPDATE_START_GRAPHQL_MULTI = 'UPDATE_START_GRAPHQL_MULTI'
export const UPDATE_END_GRAPHQL_MULTI = 'UPDATE_END_GRAPHQL_MULTI'
export const UPDATE_CHARACTER_LIST = 'UPDATE_CHARACTER_LIST'
export const MESSAGE_GRAPHQL_MULTI = 'MESSAGE_GRAPHQL_MULTI';
export const MESSAGE_CLEAR_GRAPHQL_MULTI = 'MESSAGE_CLEAR_GRAPHQL_MULTI';
export const BEGIN_LOOKAHEAD = 'BEGIN_LOOKAHEAD'
export const RECIEVE_LOOKAHEAD = 'RECIEVE_LOOKAHEAD'

const client = new ApolloClient({
  link: new HttpLink({uri: 'http://localhost:8082/graphql'}),
  cache: new InMemoryCache()
})

export const fetchAll = gql`
  query {
    characters {
      id
      name
      description
      image
      comics {
        id
        title
        image
        description
        sales {
          issue
          count
        }
      }
    }
  }
`

const update = () => {
  return gql`
    mutation UpdateCharacter($id: Int! $input: CharacterName!) {
      updateCharacter(id: $id input: $input) {
        title
      }
    }
  `
}

export const create = gql`
  mutation CreateCharacter($input: CharacterName!) {
    createCharacter(input: $input) {
      id
      name
      description
      image
      comics {
        id
        title
        image
        description
        sales {
          issue
          count
        }
      }
    }
  }
`

const lookaheadQuery = gql`
  query {
    marvel {
      name
    }
  }
`

// function beginAction() {
//   return { type: BEGIN_GRAPHQL_MULTI, data: [] }
// }

function endAction(data) {
  return { type: END_GRAPHQL_MULTI, data }
}

function beginUpdate() {
  return { type: UPDATE_START_GRAPHQL_MULTI, updated: []}
}

function endUpdate() {
  return { type: UPDATE_END_GRAPHQL_MULTI, updated: []}
}

function sendMessage(message) {
  return { type: MESSAGE_GRAPHQL_MULTI, message }
}

function clearMessage() {
  return { type: MESSAGE_CLEAR_GRAPHQL_MULTI, message: '' }
}

function sendLookahead(lookahead) {
  return { type: RECIEVE_LOOKAHEAD, lookahead }
}

function updateCharacterList(character) {
  return { type: UPDATE_CHARACTER_LIST, character }
}

export function fetchGraphql() {
  return dispatch => {
    return client.query({ query: fetchAll })
      .then(data => {
        const { data: { characters } } = data
        dispatch(endAction(characters))
      })
      .catch(err => console.log(err))
  }
}

export function updateGraphql(id, name) {
  return dispatch => {
    dispatch(beginUpdate());
    dispatch(sendMessage(`Preparing to update ${id}'s name to ${name}`))
    const variables = { id, input: { name }  }
    const mutation = update()
    return client.mutate({ mutation, variables })
      .then(graphql => {
        const { data: { createCharacter } } = graphql
        dispatch(endUpdate(createCharacter))
        dispatch(fetchGraphql())
      })
      .catch(err => console.log(err))
  }
}

export function createGraphql(name) {
  return dispatch => {
    const variables = { input: { name }}
    dispatch(sendMessage(`Preparing to add ${name}`))
    return client.mutate({ mutation: create, variables })
      .then(graphql => {
        dispatch(sendMessage(`Successfully added ${name} refreshing data from the server`))
        dispatch(updateCharacterList(graphql.data.createCharacter))
        setTimeout(() => dispatch(clearMessage()), 3000)
      })
      .catch(err => console.log(err))
  }
}

export function lookahead(search) {
  return dispatch => {
    return client.query({
      query: lookaheadQuery,
      variables: { name: search }
    })
      .then(graphql => {
        return dispatch(sendLookahead(graphql.data.marvel))
      })
      .catch(err => console.log(err))
  }
}
