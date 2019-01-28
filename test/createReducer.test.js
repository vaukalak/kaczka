// @flow
import { expect } from 'chai';
import { createDuck } from '../lib';
import type { FSACreator, FSAReducer } from '../lib';

describe('createReducer', () => {
  type State = {| x: number, events: Array<string> |};
  const INITIAL_STATE: State = { x: 10, events: [] };
  const duck = createDuck('type-test');
  type FooPayload = { foo: number };
  const foo: FSACreator<FooPayload> = duck.defineAction('FOO');


  const fooSuccessHandler = (state, action) => ({
    ...state,
    x: state.x + action.payload.foo,
  });
  const fooErrorHandler = (state, action) => ({
    ...state,
    events: [action.payload.message],
  });
  const fooHandler = (state, action) => {
    if (action.error) {
      return { ...state, events: [...state.events, action.payload.message] };
    }
    return { ...state, x: state.x - action.payload.foo };
  };

  it('success handler should modify state', () => {
    const reducer: FSAReducer<State> = duck.createReducer(INITIAL_STATE);
    reducer.withSuccessHandler(foo, fooSuccessHandler);
    const nextState = reducer(INITIAL_STATE, foo({ foo: 12 }));
    expect(nextState).to.deep.equal({ x: 22, events: [] });
  });

  it('error handler should modify state', () => {
    const reducer: FSAReducer<State> = duck.createReducer(INITIAL_STATE);
    reducer.withErrorHandler(foo, fooErrorHandler);
    const nextState = reducer(INITIAL_STATE, foo(new Error('hello world')));
    expect(nextState).to.deep.equal({ x: 10, events: ['hello world'] });
  });

  it('common handler should modify state for either success / error', () => {
    const reducer: FSAReducer<State> = duck.createReducer(INITIAL_STATE);
    reducer.withHandler(foo, fooHandler);

    let nextState = reducer(INITIAL_STATE, foo({ foo: 12 }));
    expect(nextState).to.deep.equal({ x: -2, events: [] });

    nextState = reducer(INITIAL_STATE, foo(new Error('bad')));
    expect(nextState).to.deep.equal({ x: 10, events: ['bad'] });
  });
});
