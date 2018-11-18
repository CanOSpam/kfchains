import * as types from '../actions/userTypes';

export default function userReducer(state = [], action) {
  switch (action.type) {
    case types.CREATE_USER:
      return [...state, Object.assign({}, action.user)];
    default:
      return state;
  }
}
