/* @flow */
import type {
  BaseFSACreator,
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
  const defineAction = <P, E>(baseType: string): BaseFSACreator<P, E> => {
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
    function Reducer(state = initialState, action) {
      let nextState = state;
      if (successHandlersMap[action.type] && !action.error) {
        nextState = successHandlersMap[action.type](nextState, action);
      }
      if (errorHandlersMap[action.type] && action.error) {
        nextState = errorHandlersMap[action.type](nextState, action);
      }
      if (handlersMap[action.type]) {
        nextState = handlersMap[action.type](nextState, action);
      }
      return nextState;
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
