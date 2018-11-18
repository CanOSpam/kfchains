import { 
  DRUPAL_LOGIN_SEND,
  DRUPAL_LOGIN_RECEIVE,
  DRUPAL_LOGIN_INVALID,
  DRUPAL_LOGIN_ERROR,
  DRUPAL_LOGIN_DEBUG,
  DRUPAL_LOGIN_CONTENT
} from '../actions/drupalLogin'

const initialState = {
  token: {},
  tokenDebug: {},
  content: []
}

export default function userAccessReducer(state = initialState, action) {
  const { type, token, tokenDebug, content } = action
  switch (type) {
    case DRUPAL_LOGIN_RECEIVE:
      return { ...state, token }
    case DRUPAL_LOGIN_DEBUG:
      return { ...state, tokenDebug }
    case DRUPAL_LOGIN_CONTENT:
      return { ...state, content }
    default:
      return state
  }
}