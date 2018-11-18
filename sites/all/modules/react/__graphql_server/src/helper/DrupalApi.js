import btoa from 'btoa'
import fetchWithConfig from 'node-fetch-oauth2'
import fetch from 'node-fetch'

// Import classes to assist with formatting the API response into a structure
// that represents the GraphQL Schema for the type in the graphql server.
import {
  Model as Character
} from '../types/character'


/**
 * @class DrupalApi
 */
class DrupalApi {

  /**
   * Build the Drupal API class instance.
   *
   * @function constructor
   */
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
        client_secret: process.env.CLIENT_SECRET,
        username:  process.env.DRUPAL_USER,
        password:  process.env.DRUPAL_PASSWORD
      }
    })
  }

  /**
   * Generic error handler.
   *
   * This will log errors to the GraphQL console. This could be expanded to
   * log to a file that could the be ingested by a log parser for better
   * reporting.
   *
   * @function handleError
   */
  handleErrors(error) {
    console.error(error)
  }

  /**
   * Fetch a character list from Drupal.
   *
   * @function characters
   *
   * @param {Int} nid
   *   A valid node ID which will be queried for.
   *
   * @return {Promise}
   *   Returns a promise that resolves to new characters.
   */
  async characters(nid = null) {
    const response = await this.fetch('/jsonapi/node/marvel_characters')
    const { data } = await response.json()

    return data.map(i => new Character(i))
  }

  /**
   * Create a character via the JSON API using configured creds.
   *
   * @function createCharacter
   *
   * @param {Object} character
   *   An object that matches the fields expected by JSON API.
   *
   * @return {Promise}
   *   Returns a fetch request that resolves to a single character.
   *
   * @todo Data validation on the JSON object that is given to ensure we have
   * the requried fields to create a node.
   */
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

    if (response.ok) {
      const { data } = await response.json()
      return new Character(data)
    }

    // @TODO: Error handling would be done here so we can bubble a reasonable
    // response to our clients so they can act accordingly.
    throw new Error(`Unable to create character [${response.status}]`)
  }

}

export let api = new DrupalApi()
