import * as types from '../actions/drupalAPITypes';
import Dexie from 'dexie'

// fetch-oauth2 can be used to lease a token with the API but this will require
// API credentials to be stored and served with the client application which
// may compromise the API.
import {
  tokenStorage,
  fetchWithMiddleware,
  middleware
} from 'fetch-oauth2'

class DrupalAPI {

  constructor() {
    this.storage = tokenStorage({
      fetchToken: this.generateToken,
      generateToken: this.generateToken,
    })

    this.fetch = fetchWithMiddleware(
      this.addHostToUrl,
      this.addHeader('Content-Type', 'application/vnd.api+json'),
      this.addHeader('Accept', 'application/vnd.api+json'),
      this.addHeader('Authorization', `${window.apiToken.token_type} ${window.apiToken.access_token}`),
      // middleware.setOAuth2Authorization(this.storage),
      middleware.authorisationChallengeHandler(this.storage)
    )
  }

  /**
   * Middleware to append the Drupal host to every request.
   *
   * @param {Function} next
   */
  addHostToUrl(next) {
    const host = types.DRUPAL_API_LOC
    return config => {
      return next(config.then(config => {
        return config.updateUri(uri => `${host}${uri}`)
      }));
    }
  }

  /**
   * Middleware to add headers to each request.
   *
   * @param {String} header
   * @param {String} value
   */
  addHeader(header, value) {
    return next => config => {
      return next(config.then(config => config.setHeader(header, value)))
    }
  }

  /**
   * Fetches the stored token for this client.
   */
  fetchToken() {
    return new Promise((resolve, reject) => {
      if (window.localStorage.getItem('authtoken')) {
        resolve(JSON.parse(window.localStorage.getItem('authtoken')))
      }
      reject('No token.')
    })
  }

  /**
   * Make a request to Drupal to generate a new API token.
   */
  generateToken(username = process.env.DRUPAL_USER, password = process.env.DRUPAL_PASSWORD, scope) {
    const body = [
      'grant_type=password',
      'client_id=' + process.env.CLIENT_ID,
      'client_secret=' + process.env.CLIENT_SECRET,
      'username=' + username,
      'password=' + password
    ];


    if (scope) {
      body.push('scope=' + scope.join(' '))
    }

    return fetch(process.env.DRUPAL_URL + '/oauth/token', {
        method: 'POST',
        body: body.join('&'),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => res.json())
      .then((json) => {
        if (json.error) {
          // Oauth errors are sent with a 200 response from the serve the fetch api
          // treats anything that isn't 4xx or 5xx as success so the catch will not
          // match these so we manually trigger an error.
          throw new Error(json.message)
        }

        /*
        As tokens are leased for an extended period we save the token to the
        client so they do not have to lease another token. This will be validated
        by a fetch middleware; if the token is no longer valid the middleware will
        trigger another generation and replay the request.
        */
        window.localStorage.setItem('authtoken', JSON.stringify(json))

        /*
        The fetch middleware requires an object to be returned from the token
        generation method. It expects to be able to destruct the server response
        and find the token_type (typically Bearer) and the access_token. Drupal's
        SimpleOauth formats the response correctly.
        */
        return json
      })
      .catch(err => console.error('Unable to generate token ==>', err))
  }

  /**
   * Fetch debug information about an access token.
   * 
   * @param {Object} token 
   */
  tokenDebug(token) {
    const { access_token, token_type } = token
    return fetch(process.env.DRUPAL_URL + '/oauth/debug?_format=json', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token_type} ${access_token}`
      }
    })
      .then(res => res.json())
      .then(json => json)
      .catch(err => console.error('Token Debug Error ==>', err))
  }

  fetchWithToken(token = {}) {
    const { token_type, access_token } = token

    if (!token_type || !access_token) {
      return;
    }

    let _fetch = fetchWithMiddleware(
      this.addHostToUrl,
      this.addHeader('Content-Type', 'application/vnd.api+json'),
      this.addHeader('Accept', 'application/vnd.api+json'),
      this.addHeader('Authorization', `${token_type} ${access_token}`),
    )

    return _fetch('/node/premium_content').then(res => res.json()).then(({data}) => { return data }).catch(err => {
      console.log(err)
      return []
    })
  }

  /**
   * Fetch all nodes from a given type.
   *
   * The caches API stores a request in cache ready to be served the next time
   * the browser requests the URL. It can store either a URL or a Request object
   * (which is what fetch builds) so that it can replay the request.
   *
   * If the request is not found in the cache, we will build a Request object
   * add it to the cache and then return the known promise.
   *
   * @param {String} API_LOC
   *   The API URL.
   *
   * @return {Promise}
   */
  getAllDrupal(API_LOC) {
    return this.fetch(API_LOC).then(res => res.json()).catch(err => console.log(err))
  }

  /**
   * Perform a request to fetch Drupal images.
   *
   * @param {String} API_LOC
   *
   * @return {Promise}
   */
  getAllDrupalImg(API_LOC) {
    return this.fetch(API_LOC).then(res => res.json()).catch(err => console.log(err))
  }

  /**
   * Perform a request to create a Drupal node.
   *
   * @param {String} API_LOC
   *
   * @return {Promise}
   */
  createNode(API_LOC, data = {}) {
    const body = JSON.stringify(data)
    return this.fetch(API_LOC, {
      method: 'POST',
      body
    }).then(res => res.json()).catch(err => console.log(err))
  }

  /**
   * Perform a request to delete a Drupal node.
   *
   * @param {String} API_LOC
   *
   * @return {Promise}
   */
  deleteNode(API_LOC) {
    return this.fetch(API_LOC, {
      method: 'DELETE'
    }).then(res => res.json()).catch(err => console.log(err))
  }


  /**
   * Perform a request to update a Drupal node.
   *
   * @param {String} API_LOC
   *
   * @return {Promise}
   */
  updateDrupal(API_LOC, data) {
    const body = JSON.stringify(data)
    return this.fetch(API_LOC, {
      method: 'PATCH',
      body
    }).then(res => res.json()).catch(err => console.log(err))
  }


  /**
   * Perform a request to upload an image to Drupal.
   *
   * This requires jsonapi_file to be enabled in Drupal. This module allows us
   * to send base64encoded representations of the file directly to the json
   * api and have the unencoded and stored.
   *
   * @see https://www.drupal.org/project/jsonapi_file
   *
   * @param {String} API_LOC
   *
   * @return {Promise}
   */
  uploadImages(API_LOC, filebin, name) {
    // FileReader creats a base64encoded string that decorates with the file
    // type and method and will look like data:image/jpeg;base64 this is
    // typically followed by , and then the base64encoded string of the asset.
    // We will attempt to locate the base64encoded string without the initial
    // decorator.
    filebin = filebin.split(',').slice(-1)[0]

    const body = JSON.stringify({
      data: {
        type: 'file--image',
        attributes: {
          data: filebin,
          uri: `public://${name ? name : 'api-uploaded'}.jpg`
        }
      }
    })

    return this.fetch(API_LOC, {
      method: 'POST',
      body
    }).then(res => res.json()).catch(err => console.log(err))
  }

  /**
   * Fetch all nodes IDs from a given type for use as a utility function.
   *
   * @param {String} API_LOC
   *   The API URL.
   *
   * @return {Promise}
   */
  getDrupalIDs(API_LOC) {
    return this.fetch(API_LOC)
      .then(res => res.json())
      .then(res => res.data.map(el => el.id))
      .catch(err => console.log(err))
  }

  /**
   * Load data from the browsers cache.
   *
   * This attempts to load the given API_LOC from the browsers cache. If
   * the cache does not exist it will open the cache bin and store the
   * request there ready for the next request.
   *
   * @param {String} API_LOC
   *   The API location.
   *
   * @see util/service-worker.js
   */
  loadCache(API_LOC) {
    return caches.match(types.DRUPAL_API_LOC + API_LOC)
      .then(response => {
        if (!response) {
          const request = this.fetch(API_LOC)
          caches.open('window-cache-v2').then(cache => {
            cache.add(types.DRUPAL_API_LOC + API_LOC).then(() => console.log('cache added'))
          })
          return request.then(res => res.json())
        }
        return response.json()
      })
  }

  /**
   * Load data from local storage.
   *
   * This attempts to load the given API_LOC form local storage, if there is
   * an entry found in the browsers storage it will be returned via a promise
   * (so the action can be chained with .then()). If the API_LOC is not found
   * in the local storage object, it will perform a request to the json api
   * server to fetch the data and then store that information in local storage.
   *
   * Local storage can store simple key:value pairs and the value cannot be
   * complex objects, so we have to JSON.stringify before inserting.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * @see https://developers.google.com/web/tools/chrome-devtools/manage-data/local-storage
   *
   * @param {String} API_LOC
   *   The API url to request.
   *
   * @return {Promise}
   *   A promise that will resolve to the result of the fetch request.
   */
  loadLocalStorage(API_LOC) {
    if (localStorage.getItem(API_LOC)) {
      // Expecting a promise - localStorage is synchronous so it will return the
      // data as it sees it in the store. We wrap this in a simple promise so
      // have a unified way to handle this call.
      return new Promise((resolve) => { // , reject
        const json = JSON.parse(localStorage.getItem(API_LOC))
        resolve(json);
      })
    }

    return this.fetch(API_LOC)
      .then(res => res.json())
      .then(json => {
        localStorage.setItem(API_LOC, JSON.stringify(json))
        return new Promise((resolve) => resolve(json))
      })
      .catch(err => console.log(err))
  }


  /**
   * Cache example that relies on IndexedDB to store the result.
   *
   * We have opted to use the Dexie package here as this wraps the indexeddb
   * api in Promises so we have consistency with how these methods return
   * data to the actions.
   *
   * This method handles creating the indexeddb database if it doesn't
   * exist and loading from the cache if the path is recognised. As with
   * local storage indexeddb doesn't store complex objects types. It can
   * however store JSON objects unlike local storage so we are able to
   * insert the response directly into the table.
   *
   * Both Google and Mozilla suggest the indexedDB API is complicated and
   * suggest abstracting it with various recommended packages.
   *
   * @see http://dexie.org/
   * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
   * @see https://developers.google.com/web/ilt/pwa/working-with-indexeddb
   *
   * @param {String} API_LOC
   *   The
   */
  loadIndexedDB(API_LOC) {
    // Create the indexedDB.
    const db = new Dexie('test-db')
    db.version(1).stores({
      requests: 'path, data'
    });

    db.open().catch(err => console.error('UNABLE TO OPEN DB', err))

    return db.table('requests').where('path').equals(API_LOC).first(response => {
        return new Promise(resolve => resolve(response.data))
      })
      .catch(err => {
        console.log(err);
        return this.fetch(API_LOC)
          .then(res => res.json())
          .then(json => {
            db.table('requests').add({
              path: API_LOC,
              data: json
            })
            return new Promise(resolve => resolve(json))
          })
          .catch(err => console.log(err))
      })
  }

  clearCaches() {
    // Clear the caches.
    caches.keys().then(cacheNames => {
      cacheNames.map(cacheName => {
        caches.delete(cacheName)
      })
    })
    localStorage.clear()
    Dexie.delete('test-db')
  }

}

export let drupalAPI = new DrupalAPI()
