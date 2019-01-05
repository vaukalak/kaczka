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
  type DefineAction<P, E = Error> = (baseType: string) => FSACreator<P, E>;

  const defineAction = <P, E>(baseType: string): FSACreator<P, E> => {
    const type = `${namespace}/${baseType}`;
    const actionCreator = (payload: P | E, isError): FSA<P, E> => {
      const error = (
        payload instanceof Error && isError !== false
      ) || isError === true;
      if (error) {
        return {
          type,
          // TODO: check if can avoid cast through `any`
          payload: ((payload: any): E),
          error: true,
        };
      }
      return {
        type,
        // TODO: check if can avoid cast through `any`
        payload: ((payload: any): P),
        error: false,
      };
    };
    actionCreator.ACTION_TYPE = type;
    return actionCreator;
  };

  const createReducer = <S>(initialState: S): FSAReducer<S> => {
    const handlersMap = {};
    const successHandlersMap = {};
    const errorHandlersMap = {};
    function Reducer(state, actions) {
      return state;
    }
    Reducer.withHandler = (actionCreator, reducer) => {
      handlersMap[actionCreator.ACTION_TYPE] = reducer;
      return Reducer;
    };
    Reducer.withSuccessHandler = (actionCreator, reducer) => {
      successHandlersMap[actionCreator.ACTION_TYPE] = reducer;
      return Reducer;
    };
    Reducer.withErrorHandler = (actionCreator, reducer) => {
      errorHandlersMap[actionCreator.ACTION_TYPE] = reducer;
      return Reducer;
    };
    return Reducer;
  };

  return {
    defineAction,
    createReducer,
  };
};
