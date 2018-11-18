import {
  BEGIN_GRAPHQL,
  RECEIVE_GRAPHQL
} from '../actions/graphqlclientActions'

export default function graphqlclientReducer(state = { data: [] }, action) {
  const { type, data } = action
  switch (type) {
    case BEGIN_GRAPHQL:
      return Object.assign({}, state)
    case RECEIVE_GRAPHQL:
      return Object.assign({}, state, { data })
    default:
      return state
  }
}
