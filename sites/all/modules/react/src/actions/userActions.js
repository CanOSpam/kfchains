import * as types from './userTypes';

export function createUser(user) {
  return {
    type: types.CREATE_USER,
    user: user
  };
}
