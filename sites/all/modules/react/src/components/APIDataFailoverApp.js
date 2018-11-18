import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import * as actions from '../actions/failoverActions';
import Client from './Client';
import '../styles/apidatafailover.scss';

/*eslint-disable no-console */

class APIDataFailoverApp extends Component {

  constructor(props, store) {
    super(props, store);

    this.onLocalStorageClick = this.onLocalStorageClick.bind(this)
    this.onIndexedDbClick = this.onIndexedDbClick.bind(this)
    this.onCacheClick = this.onCacheClick.bind(this)
    this.onClearCachesClick = this.onClearCachesClick.bind(this)

    /**
     * Flags to determine if the current browser supports the different client
     * side caching mechanisms.
     *
     * Caches seems the most flexible and easiest to implement when caching API
     * requests, however it doesn't cache arbitrary data for arbitrary data
     * caching (perhaps a single field from an API etc.) local storage would
     * be better.
     *
     * IndexedDB is great for storing application states - it provides a
     * relational database per client that loads your application. This is
     * great for offline applications but will be overkill in most use cases.
     */
    this.state = {
      canCache: ('caches' in window),
      canLocalStorage: ('localStorage' in window),
      canIndexedDb: ('indexedDB' in window)
    }
  }

  onCacheClick() {
    this.props.actions.fetchCache()
  }

  onIndexedDbClick() {
    this.props.actions.fetchIndexedDb()
  }

  onLocalStorageClick() {
    this.props.actions.fetchLocalStorage()
  }

  onClearCachesClick() {
    this.props.actions.clearCaches()
  }

  render() {
    const { canCache, canIndexedDb, canLocalStorage } = this.state
    let render = { caches: null, localStorage: null, indexedDb: null }

    for (let key in this.props) {
      if (key === 'actions' || !this.props[key]) {
        continue
      }

      let {
        field_client_email,
        field_country,
        field_first_name,
        field_last_name
      } = this.props[key].attributes

      render[key] = (<Client
        email={field_client_email}
        country={field_country}
        firstName={field_first_name}
        lastName={field_last_name}
        uuid={this.props[key].id}
        type={key}
      />)

    }

    return (

      <div className="holder">

        <h4>Methods of API Failover</h4>
        <p>
          <b>Story:</b> As a developer, I want to understand common tools and techniques for scenarios in which my application depends on an API(s) which is unavailable.
        </p>
        <p></p>

        <div className="caching-buttons">
          <ul>
            {canCache ? (
              <li>
                <h4>window.caches</h4>
                <p>Using the <a target="_blank" rel="noopener noreferrer" href="https://developer.mozilla.org/en-US/docs/Web/API/Cache">browsers caches API</a> to load content from an API. The cache API stores a HTTP request resource locally and allows us to replay the request which allows the browser to display a remote resource without an internet connection. One thing to note about the cache API is that this is a permanent cache and will not be removed until the application triggers a manual cache purge. The caches API can be preloaded with a service worker.</p>
                <input type="button" onClick={this.onCacheClick} value={"Load from cache"} />
              </li>) : <li>Cache API is unavailable use a newer browser.</li>}

            {canLocalStorage ? (
              <li>
                <h4>window.localStorage</h4>
                <p><a target="_blank" rel="noopener noreferrer" href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage">Local storage</a> allows the browser to store simple <code>key:value</code> pairs. These values can be string representations of JSON objects however you are limited by the storage size. Local storage shares a storage capacity with Session Storage and can not exceed 10mb.</p>
                <input type="button" onClick={this.onLocalStorageClick} value={"Load from LocalStorage"} />
              </li>) : <li>LocalStorage API is unavailable use a newer browser.</li>}

            {canIndexedDb ? (
              <li>
                <h4>window.indexedDb</h4>
                <p><a target="_blank" rel="noopener noreferrer" href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API">IndexedDB</a> uses local HDD space to create a relational database for a web application. It is used to store and retrieve javascript objects by a known key. To begin with IndexedDB you need to open a connection to the database and then specify a schema, after which you can interact with the database as you would a SQL-based RDBMS. The IndexedDB API is complex and does not use the Promise API, but there are packages like <a target="_blank" rel="noopener noreferrer" href="http://dexie.org/">Dexie</a> which provide this functionality.</p>
                <input type="button" onClick={this.onIndexedDbClick} value={"Load from IndexedDB"} />
              </li>) : <li>IndexedDB API is unavailable use a newer browser.</li>}

          </ul>
          <p className="clear-caches"><input type="button" className="danger" onClick={this.onClearCachesClick} value={"Clear All Caches"} /></p>

          <p className="note">
            <strong>Note:</strong> only the requests to the backend APIs are cached in the demo, images will rely on regular HTTP caching methods and may need to load for the initial request,
           if images are key to the performance of your application you can look to send <code>base64encoded</code> representations from the API and have those stored with these caching mechanisms
          <br />
            <strong>Note:</strong>Caches may need to be warmed prior to loading from cache. As this is client side caching it will need to be done by each client that connects to the application.
          </p>
        </div>

        <div className={"node-rows"}>
          {render.caches}
          {render.localStorage}
          {render.indexedDb}
        </div>

      </div>

    );
  }
}

APIDataFailoverApp.propTypes = {
  actions: PropTypes.object.isRequired,
  key: PropTypes.string,
}

export function mapStateToProps(state) {
  const { failoverReducer: { caches, localStorage, indexedDb } } = state
  return { caches, localStorage, indexedDb }
}

export function MapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, MapDispatchToProps)(APIDataFailoverApp);
