import crypto from 'crypto'
import fetch from 'node-fetch'

// Import classes to assist with formatting the API response into a structure
// that represents the GraphQL Schema for the type in the graphql server.
import { Model as Comic } from '../types/comic'
import { Model as Character } from '../types/character'

/**
---- ENVIRONMENT VARIABLES ----
dotenv stores configuration variables in a local .env file. This allows us to
store API credentials locally and rely on environment variables in production
to store important credentials.

dotenv will not override environment defined variables with those in the file.

@see https://github.com/motdotla/dotenv
@see https://github.com/motdotla/dotenv/issues/133#issuecomment-321779690
*/

/**
 * Mavel API Abstraction class.
 *
 * @class MarvelApi
 */
class MarvelApi {

  /**
   * Build the instance and prepare API credentials.
   *
   *  @function constructor
   */
  constructor() {
    /**
     * ---- ENVIRONMENT VARIABLES ----
     * dotenv stores configuration variables in a local .env file. This allows us to
     * store API credentials locally and rely on environment variables in production
     * to store important credentials.
     *
     * dotenv will not override environment defined variables with those in the file.
     *
     * @see https://github.com/motdotla/dotenv
     * @see https://github.com/motdotla/dotenv/issues/133#issuecomment-321779690
     */
    const privateKey = process.env.API_PRIVATE_KEY;
    const publicKey = process.env.API_PUBLIC_KEY;

    const ts = Date.now();
    const hash = crypto.createHash('md5').update(`${ts}${privateKey}${publicKey}`).digest('hex');

    this.url = 'http://gateway.marvel.com/v1/public';
    this.params = `ts=${ts}&apikey=${publicKey}&hash=${hash}`;
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
    console.log(error)
    return []
  }

  /**
   * Fetch a character list from Marvel.
   *
   * @function characters
   *
   * @param {String} name
   *   A character name which will be queried for.
   *
   * @return {Promise}
   *   Returns a promise that resolves to new characters.
   */
  characters(name = null) {
    // Marvel API is limited to 100.
    let params = this.params + '&limit=100'
    if (!!name) {
      params += `&name=${name}`
    }

    const url = `${this.url}/characters?${params}`;

    return fetch(url)
      .then(res => res.json())
      .catch(this.handleErrors);
  }


  /**
   * Fetch a comic list from Marvel.
   *
   * @function comics
   *
   * @param {Int} id
   *   A character id which will be queried for.
   *
   * @return {Promise}
   *   Returns a promise that resolves to a comic list.
   */
  comics(id) {
    const url = `${this.url}/characters/${id}/comics?${this.params}`;

    return fetch(url)
      .then(res => res.json())
      .then(json => json.data.results.map(i => new Comic(i)))
      .catch(this.handleErrors);
  }
}

// This is the singleton pattern for NodeJS - this will allow all types to use
// the same instance of MarvelApi.
export let api = new MarvelApi();
