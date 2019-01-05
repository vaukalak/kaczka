// @flow
import { expect } from 'chai';
import { createDuck } from '../lib';
import type {FSACreator, FSAReducer} from '../lib';
import type {FSASuccess} from '../lib/declarations';

describe('createReducer', () => {
  type State = {| x: number, y: string |};
  const INITIAL_STATE: State = { x: 10, y: '0' };
  const duck = createDuck('type-test');
  const reducer: FSAReducer<State> = duck.createReducer(INITIAL_STATE);
  type FooPayload = {| foo: number |};
  const foo: FSACreator<FooPayload, Error> = duck.defineAction('FOO');

  const fooHandler = (state, action) => ({ ...state, x: state.x + action.payload.foo });

  reducer.withSuccessHandler(foo, fooHandler);

  it('handler should modify state', () => {
    const nextState = reducer(INITIAL_STATE, foo({ foo: 12 }));
    expect(nextState).to.deep.equal({ x: 22, y: '0' });
  });
});
