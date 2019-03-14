// @flow
/* eslint-disable no-console */
import {
  createUsersListDuck,
} from './createUserListDuck';

const usersListDuck = createUsersListDuck('users');

console.log(usersListDuck.actions.setAvatarPhoto.actionType);
console.log(usersListDuck.actions.setPhoto.actionType);

console.log(JSON.stringify(usersListDuck.reducer(
  usersListDuck.INITIAL_STATE,
  usersListDuck.actions.setPhoto({
    error: new Error('hello!'),
    userIndex: 0,
    albumIndex: 0,
    photoIndex: 0,
  }, true),
), undefined, 2));
