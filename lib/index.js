/* @flow */
import type {
  BaseFSACreator,
  FSA,
  FSACreator,
  FSAHandler,
  FSAReducer,
  ActionMatcherType,
} from './declarations';
import { ActionMatchers } from './declarations';

export type {
  FSA,
  FSACreator,
  FSAHandler,
  FSAReducer,
  ActionMatcherType,
};

export {
  ActionMatchers,
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
    const createModifierFunction = map => (state, action) => {
      if (map[action.type]) {
        return map[action.type](state, action);
      } if (map[ActionMatchers.DEFAULT]) {
        return map[ActionMatchers.DEFAULT](state, action);
      }
      return state;
    };
    const successModifier = createModifierFunction(successHandlersMap);
    const errorModifier = createModifierFunction(errorHandlersMap);
    const modifier = createModifierFunction(handlersMap);
    function Reducer(state: S = initialState, action) {
      let nextState = state;
      if (!action.error) {
        nextState = successModifier(nextState, action);
      }
      if (action.error) {
        nextState = errorModifier(nextState, action);
      }
      return modifier(nextState, action);
    }
    const createSubscribeMethod = map => (actionCreatorOrType, handler) => {
      if (typeof actionCreatorOrType === 'string') {
        map[actionCreatorOrType] = handler;
      } else {
        map[actionCreatorOrType.ACTION_TYPE] = handler;
      }
      return Reducer;
    };
    Reducer.withHandler = createSubscribeMethod(handlersMap);
    Reducer.withSuccessHandler = createSubscribeMethod(successHandlersMap);
    Reducer.withErrorHandler = createSubscribeMethod(errorHandlersMap);
    return Reducer;
  };

  return {
    defineAction,
    createReducer,
  };
};
