### Overview

This component illustrates various methods of handling scenarios for how to handle failed API connectivity or slow data connections. The examples focus on various methods of storing pre-existing data for display within the React application. Each of the methods uses the same "Client" content type and is labeled accordingly in the application. The methods and associated functions are named according to the technique and are documented below according to workflow.

### 'Client' content fields in Drupal

```
Title  |  title | Text (plain)
First Name | field_first_name | Text (plain)
Last Name | field_last_name | Text (plain)
Email | field_client_email | Email
Country | field_country | Text (plain)
```

### Application structure and scaffolding


#### `src/components/App.js`

```
# The container is initially referenced using the ES6 `import` statement
import APIDataFailoverPage from '../containers/APIDataFailoverPage';
```

```
# The route is then added to the primary menu
<NavLink to="/apidatafailover" activeStyle={activeStyle}>API Data Failover</NavLink>
```

```
# The container is targeted for the route using the React Router module
<Route path="/apidatafailover" component={APIDataFailoverPage} />
```

#### `src/containers/APIDataFailoverPage.js`

```
# Redux binding is imported for the container
import {connect} from 'react-redux';
```

```
# The component is then imported 
import APIDataFailoverApp from '../components/APIDataFailoverApp';
# Then rendered within the container as a component 
render() { ....
 <APIDataFailoverApp /> 
```

```
# The component is then connected to the Redux store
export default connect()(APIDataFailoverPage); 
```


#### `src/components/APIDataFailoverApp.js`

This component file serves as the central point of execution for the visual elements of the structure. The core functionality revolves around the API action functions referenced as `../actions/failoverActions` in this file, which is stored in Redux and passed down to the inner components. The component also includes the sub-component `Client` which is passed both `props` and `state` from this parent component.

#### `src/components/CLient.js`

This component serves as the UI layer to render the stored data as a visual element for each of the 3 techniques. As with the prior component, data is pulled from the Redux object and passed through the `props` when interacting with the application.

#### src/api/drupalAPI.js

This component stores each of the original storage methods by core functionality. The `loadCache` function uses a service worker to reference the `window.caches` for the storage device, which is referenced and leveraged in the associated files `src/util/registerServiceWorker.js` and `src/util/service-worker.js`. The `loadLocalStorage` function stores and references the data according to the `localStorage` method, then allows it to be referenced as `key:value` JSON objects. The `loadIndexedDB` function leverages the `Dexie` package to create a local HDD space to create a relational database for reference. The `clearCaches` is used as a utility method to clear each of the caches with their matching option.

### Interacting with the storage methods

#### src/components/APIDataFailoverApp.js

The primary execution of the storage interaction is executed within the `src/components/APIDataFailoverApp.js` file. This is referenced in the file as `import * as actions from '../actions/failoverActions'` before binding within the standard Redux workflow. These actions are named according to their functionality in the `src/actions/failoverActions.js` file, as this file serves most of the Redux actions for each of the interactions. As per the standard Redux workflow, reducers utilized as the final step to append the state. Each of the actions associated to the method are bound by a button click as: `fetchCache` `fetchIndexedDb` `fetchLocalStorage`. All the caches are cleared with the action click `clearCaches`.
  
  
#### Window.Cache technique

```
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
   * @see service-worker.js
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
```



#### Window.LocalStorage

```
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
```


#### Window.IndexedDb

```
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
```

### External References & Resources 

- [Web Workers API -  MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [Service Worker API -  MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Window.localStorage - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [IndexedDB API - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Dexie - npm package](https://www.npmjs.com/package/dexie)
