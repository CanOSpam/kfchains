import fetchWithConfig from 'node-fetch-oauth2'

// Import classes to assist with formatting the API response into a structure
// that represents the GraphQL Schema for the type in the graphql server.
import {
  Model as Pokemon
} from '../types/pokemon'

import {
  Model as Ability
} from '../types/pokemon_ability'

import {
  Model as Types
} from '../types/pokemon_types'

class PokemonApi {

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
        client_secret: process.env.CLIENT_SECRET,
        username: process.env.DRUPAL_USER,
        password: process.env.DRUPAL_PASSWORD
      }
    })
  }

  handleErrors(error) {
    console.error(error);
  }

  async pokemons(nid = null) {
    const response = await this.fetch('/jsonapi/node/pokemon')
    const { data } = await response.json()

    return data.map(i => new Pokemon(i))
  }

  async abilities(uuid) {
    const response = await this.fetch(`/jsonapi/node/pokemon/${uuid}/field_abilities`)
    const { data } = await response.json()

    return data.map(i => new Ability(i))
  }

  async ref_types(uuid) {
    const response = await this.fetch(`/jsonapi/node/pokemon/${uuid}/field_type_pokemon_ref`)
    const { data } = await response.json()

    return data.map(i => new Types(i))
  }

}

export let api = new PokemonApi();
