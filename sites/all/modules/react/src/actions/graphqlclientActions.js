import gql from 'graphql-tag'

import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

export const BEGIN_GRAPHQL = 'BEGIN_GRAPHQL'
export const RECEIVE_GRAPHQL = 'RECEIVE_GRAPHQL'

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:8082/graphql' }),
  cache: new InMemoryCache()
})

export const query = gql`
  query {
    pokemons {
      id
      nid
      pokemon_id
      title
      back_shiny_sprite
      front_shiny_sprite
      height_pokemon
      weight_pokemon
      hp
      attack
      defense
      special_attack
      special_defense
      speed
      abilities {
        id
        type
        name
        description
      }
      ref_types {
        id
        type
        name
        description
      }
    }
  }
`;

const beginFetch = () => {
  return { type: BEGIN_GRAPHQL, data: [] }
}

const receiveFetch = (data) => {
  return { type: RECEIVE_GRAPHQL, data }
}

export function fetchData() {
  return dispatch => {
    dispatch(beginFetch())
    return client.query({ query }).then(graphql => {
      const { data: { pokemons } } = graphql
      dispatch(receiveFetch(pokemons))
    })
      .catch(err => console.log(err))
  }
}
