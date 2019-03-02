// @flow
import { combineReducers } from 'redux';
import { type DuckSpec } from '..';

export type MapStates<Map> =
  $ObjMap<Map, <S, A>(DuckSpec<S, A>) => S>;

export const combineDucks = <Map: Object, Actions: Object>(
  map: Map,
): DuckSpec<MapStates<Map>, Actions> => {
  const keys = Object.keys(map);
  const reducersSpec = keys.reduce(
    (acc, key) => ({
      ...acc,
      [key]: map[key].reducer,
    }),
    {},
  );
  return {
    reducer: combineReducers(reducersSpec),
    actions: ((keys.reduce(
      (acc, key) => ({
        ...acc,
        ...map[key].actions,
      }),
      {},
    ): any): Actions),
    INITIAL_STATE: keys.reduce(
      (acc, key) => ({
        ...acc,
        [key]: map[key].INITIAL_STATE,
      }),
      {},
    ),
  };
};
