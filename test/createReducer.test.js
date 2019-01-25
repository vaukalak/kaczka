// @flow
import { expect } from 'chai';
import { createDuck } from '../lib';
import type { FSAReducer } from '../lib';

describe('createReducer', () => {
  type State = {| x: number, y: string |};
  const INITIAL_STATE: State = { x: 10, y: '0' };
  const duck = createDuck('type-test');
  type FooPayload = { foo: number };
  const foo = duck.defineAction<FooPayload, Error>('FOO');


  const fooSuccessHandler = (state, action) => ({
    ...state,
    x: state.x + action.payload.foo,
  });
  const fooErrorHandler = (state, action) => ({
    ...state,
    y: action.payload.message,
  });
  const fooHandler = (state, action) => {
    if (action.error) {
      return { ...state, y: action.payload.message };
    }
    return { ...state, x: state.x - action.payload.foo };
  };

  it('success handler should modify state', () => {
    const reducer: FSAReducer<State> = duck.createReducer(INITIAL_STATE);
    reducer.withSuccessHandler(foo, fooSuccessHandler);
    const nextState = reducer(INITIAL_STATE, foo({ foo: 12 }));
    expect(nextState).to.deep.equal({ x: 22, y: '0' });
  });

  it('error handler should modify state', () => {
    const reducer: FSAReducer<State> = duck.createReducer(INITIAL_STATE);
    reducer.withErrorHandler(foo, fooErrorHandler);
    const nextState = reducer(INITIAL_STATE, foo(new Error('hello world')));
    expect(nextState).to.deep.equal({ x: 10, y: 'hello world' });
  });

  it('common handler should modify state for either success / error', () => {
    const reducer: FSAReducer<State> = duck.createReducer(INITIAL_STATE);
    reducer.withHandler(foo, fooHandler);

    let nextState = reducer(INITIAL_STATE, foo({ foo: 12 }));
    expect(nextState).to.deep.equal({ x: -2, y: '0' });

    nextState = reducer(INITIAL_STATE, foo(new Error('bad')));
    expect(nextState).to.deep.equal({ x: 10, y: 'bad' });
  });
});
