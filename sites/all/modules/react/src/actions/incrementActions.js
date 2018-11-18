import * as types from './incrementTypes';

export function createNumber(number) {
  return {
    type: types.UPDATE_INCREMENT,
    number: number
  };
}
