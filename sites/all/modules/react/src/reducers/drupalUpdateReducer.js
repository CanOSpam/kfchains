import * as types from '../actions/drupalAPITypes';

export default function drupalUpdateReducer(state = [], action) {
  switch (action.type) {
    case types.UPDATE_DRUPAL_SUCCESS:
      return action.drupal_api_update;
    default:
      return state;
  }
}
