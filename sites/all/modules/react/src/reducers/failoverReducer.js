import {
  FETCH_CACHE,
  FETCH_LOCAL_STORAGE,
  FETCH_INDEXEDDB
} from '../actions/failoverActions'

const initialState = {
  caches: null,
  localStorage: null,
  indexedDb: null
}

export default function failoverReducer(state = initialState, action) {
  const { type, data } = action
  switch (type) {
    case FETCH_CACHE:
      return {...state, caches: data}
    case FETCH_LOCAL_STORAGE:
      return {...state, localStorage: data}
    case FETCH_INDEXEDDB:
      return {...state, indexedDb: data}
    default:
      return state
  }
}