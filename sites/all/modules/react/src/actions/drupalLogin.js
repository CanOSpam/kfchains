import { drupalAPI } from '../api/drupalAPI'
import envVars from '../../tools/envVars'

export const DRUPAL_LOGIN_SEND = 'DRUPAL_LOGIN_SEND'
export const DRUPAL_LOGIN_RECEIVE = 'DRUPAL_LOGIN_RECEIVE'
export const DRUPAL_LOGIN_INVALID = 'DRUPAL_LOGIN_INVALID'
export const DRUPAL_LOGIN_ERROR = 'DRUPAL_LOGIN_ERROR'
export const DRUPAL_LOGIN_DEBUG = 'DRUPAL_LOGIN_DEBUG'
export const DRUPAL_LOGIN_CONTENT = 'DRUPAL_LOGIN_CONTENT'

const loginSend = () => {
  return { type: DRUPAL_LOGIN_SEND }
}

const loginReceive = (token) => {
  return { type: DRUPAL_LOGIN_RECEIVE, token }
}

const loginInvalid = () => {
  return { type: DRUPAL_LOGIN_INVALID }
}

const loginError = (reason) => {
  return { type: DRUPAL_LOGIN_ERROR, reason }
}

const loginDebug = (tokenDebug) => {
  return { type: DRUPAL_LOGIN_DEBUG, tokenDebug }
}

const loginContent = (content) => {
  return { type: DRUPAL_LOGIN_CONTENT, content }
}

export const getDebug = (token) => {
  return dispatch => {
    return drupalAPI.tokenDebug(token)
      .then(json => dispatch(loginDebug(json)))
      .catch(err => console.log(err))
  }
}

export const doLogin = ({username, password, scope}) => {
  return dispatch => {
    const requestScope = Object.keys(scope).filter(s => scope[s] === true)

    if (!username) {
      return dispatch(loginError('We need a valid username to log you in.'))
    }

    if (!password) {
      return dispatch(loginError('We need a valid password to log you in.'))
    }

    drupalAPI.generateToken(username, password, requestScope)
      .then(token => { 
        dispatch(loginReceive(token))
        return Promise.resolve(token)
      })
      .then(token => { 
        getDebug(token)(dispatch)
        fetchContent(token)(dispatch)
      })
  }
}

export const fetchContent = (token) => {
  return dispatch => {
    return drupalAPI.fetchWithToken(token).then(json => dispatch(loginContent(json)))
  }
}