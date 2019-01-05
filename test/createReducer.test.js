// @flow
import { createDuck } from '../lib';

describe('createReducer', () => {
  it('handler should modify state', () => {
    createDuck('type-test');
  });
});
