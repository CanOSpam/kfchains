import * as types from '../actions/incrementTypes';

export default function incrementReducer(state = [], action) {
  switch (action.type) {
    case types.UPDATE_INCREMENT:
      return action.number;
    default:
      return state;
  }
}
