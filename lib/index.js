/* @flow */
import type {
  FSA,
  FSACreator,
  FSAHandler,
  FSAReducer,
} from './declarations';

export type {
  FSA,
  FSACreator,
  FSAHandler,
  FSAReducer,
};

export const createDuck = (namespace: string) => {
  const defineAction = <P>(baseType: string): FSACreator<P> => {
    const type = `${namespace}/${baseType}`;
    const actionCreator = (payload: P) => (
      payload instanceof Error ?
        ({ type, payload, error: true }) :
        ({ type, payload, error: false })
    );
    actionCreator.ACTION_TYPE = type;
    return actionCreator;
  };

  const createReducer = <S>(initialState: S): FSAReducer<S> => {
    const handlersMap = {};
    function Reducer(state, actions) {
      return state;
    }
    Reducer.withHandler = (actionCreator, reducer) => {
      handlersMap[actionCreator.ACTION_TYPE] = reducer;
      return Reducer;
    };
    return Reducer;
  };

  return {
    defineAction,
    createReducer,
  };
};
