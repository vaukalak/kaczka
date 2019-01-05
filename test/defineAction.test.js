// @flow
import { expect } from 'chai';
import { createDuck } from '../lib';
import type {FSACreator} from '../lib';

describe('createReducer', () => {
  const duck = createDuck('define-action-test');
  const foo = duck.defineAction('FOO');

  it('action creator should contain namespaced ACTION_TYPE field', () => {
    expect(foo.ACTION_TYPE).to.equal('define-action-test/FOO');
  });

  it('action type should be namespaced', () => {
    expect(foo().type).to.equal('define-action-test/FOO');
  });
});
