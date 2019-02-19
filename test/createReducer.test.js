// @flow
import { expect } from 'chai';
import { ActionMatchers, createDuck } from '../src';
import type { FSACreator, FSAReducer } from '../src';

describe('createReducer', () => {
  type State = {| x: number, events: Array<string> |};
  const INITIAL_STATE: State = { x: 10, events: [] };
  const duck = createDuck('type-test');
  type FooPayload = { foo: number };
  const foo: FSACreator<FooPayload, Error> = duck.defineAction('FOO');
  const bar: FSACreator<void, Error> = duck.defineAction('BAR');


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

  // DEFAULT

  const defaultHandler = (state, { type }) => ({
    ...state,
    events: [...state.events, type],
  });

  it('should invoke DEFAULT handler, when no other handler mapped', () => {
    const reducer: FSAReducer<State> = duck.createReducer(INITIAL_STATE);
    reducer.withHandler(ActionMatchers.DEFAULT, defaultHandler);
    let nextState = reducer(INITIAL_STATE, { type: 'A', payload: undefined });
    nextState = reducer(nextState, { type: 'B', payload: undefined });
    expect(nextState.events).to.deep.equal(['A', 'B']);
  });

  it('should not invoke DEFAULT when, there already a handler', () => {
    const reducer: FSAReducer<State> = duck.createReducer(INITIAL_STATE);
    reducer.withHandler('A', state => state);
    reducer.withHandler(ActionMatchers.DEFAULT, defaultHandler);
    let nextState = reducer(INITIAL_STATE, { type: 'A', payload: undefined });
    nextState = reducer(nextState, { type: 'B', payload: undefined });
    nextState = reducer(nextState, bar());
    expect(nextState.events).to.deep.equal(['B', 'type-test/BAR']);
  });

  it('should invoke DEFAULT when action is only mapped for error', () => {
    const reducer: FSAReducer<State> = duck.createReducer(INITIAL_STATE);
    reducer.withHandler('A', state => state);
    reducer.withHandler(ActionMatchers.DEFAULT, defaultHandler);
    let nextState = reducer(INITIAL_STATE, { type: 'A', payload: undefined });
    nextState = reducer(nextState, { type: 'B', payload: undefined });
    nextState = reducer(nextState, bar());
    expect(nextState.events).to.deep.equal(['B', 'type-test/BAR']);
  });

  it('should invoke DEFAULT on success handler when action is only mapped for error', () => {
    const reducer: FSAReducer<State> = duck.createReducer(INITIAL_STATE);
    reducer.withErrorHandler('A', state => state);
    reducer.withSuccessHandler(ActionMatchers.DEFAULT, defaultHandler);
    const nextState = reducer(INITIAL_STATE, { type: 'A', payload: undefined });
    expect(nextState.events).to.deep.equal(['A']);
  });

  it('should not invoke DEFAULT on success handler when action is only mapped on common handler', () => {
    const reducer: FSAReducer<State> = duck.createReducer(INITIAL_STATE);
    reducer.withHandler('A', state => state);
    reducer.withSuccessHandler(ActionMatchers.DEFAULT, defaultHandler);
    const nextState = reducer(INITIAL_STATE, { type: 'A', payload: undefined });
    expect(nextState.events).to.deep.equal([]);
  });
});
