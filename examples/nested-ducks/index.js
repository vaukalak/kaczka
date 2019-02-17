// @flow
/* eslint-disable no-console */
import createAlbumDuck from './albumDuck';

const duck = createAlbumDuck();

// NOTE: action type, contain `album` in path, with this pattern you can easily reuse base actions
console.log('duck.actions.setPhoto.actionType: ', duck.actions.setPhoto.actionType);

let state = duck.reducer(
  duck.INITIAL_STATE,
  duck.actions.setLabel({ index: 0, updatedAt: new Date().toISOString(), label: 'hello' }),
);

state = duck.reducer(
  state,
  // here the error payload is not instance of Error, so we need to set `true`
  // good news, is that flow will warn you on that.
  duck.actions.setLabel({ index: 0, error: new Error() }, true),
);

console.log(state);
