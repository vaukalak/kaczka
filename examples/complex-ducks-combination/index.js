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
    url: '123',
    updatedAt: '12341234',
    userIndex: 0,
    albumIndex: 0,
    photoIndex: 0,
  }),
), undefined, 2));
