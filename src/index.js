/* @flow */
import type {
  FSACreator,
  FSA,
  FSAHandler,
  FSAReducer,
  ActionMatcherType,
  ActionEnhancer,
  Duck,
  DuckSpec,
} from './declarations';
import { ActionMatchers } from './declarations';

export {
  ActionMatchers,
};

export const createDuck = (namespace: string) => {
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
    actionCreator.actionType = type;
    return actionCreator;
  };

  const createReducer = <S>(initialState: S): FSAReducer<S> => {
    const handlersMap = {};
    const successHandlersMap = {};
    const errorHandlersMap = {};
    const createModifierFunction = map => (state, action) => {
      if (map[action.type]) {
        return map[action.type](state, action);
      } if (map[ActionMatchers.DEFAULT] && !handlersMap[action.type]) {
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
        map[actionCreatorOrType.actionType] = handler;
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

export type {
  FSA,
  FSACreator,
  FSAHandler,
  FSAReducer,
  ActionEnhancer,
  ActionMatcherType,
  Duck,
  DuckSpec,
};
