import * as types from '../actions/drupalAPITypes';

export default function drupalLoadImgReducer(state = [], action) {
  switch (action.type) {
    case types.LOAD_DRUPAL_IMG_SUCCESS:
      return action.drupal_api_load_img;
    default:
      return state;
  }
}
