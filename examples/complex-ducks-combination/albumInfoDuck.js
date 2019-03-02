// @flow
import { createDuck } from '../../src';
import type { DuckSpec } from '../../src';

export type AlbumInfoState = $Exact<{
  title: string,
  description: string,
}>;

const INITIAL_STATE = Object.freeze({ title: '', description: '' });

const albumInfoDuck = (
  parentNamespace: string = '',
): DuckSpec<*, *> => {
  const duck = createDuck(`${parentNamespace}/info`);

  const setTitle = duck.defineAction<{ title: string }, Error>('SET_TITLE');
  const setDescription = duck.defineAction<{ description: string }, Error>('SET_DESCRIPTION');

  const reducer = duck.createReducer<AlbumInfoState>(INITIAL_STATE);

  reducer.withSuccessHandler(
    setTitle,
    (state, { payload }) => ({
      ...state,
      title: payload.title,
    }),
  );

  reducer.withSuccessHandler(
    setDescription,
    (state, { payload }) => ({
      ...state,
      description: payload.description,
    }),
  );

  return {
    reducer,
    actions: {
      setTitle,
      setDescription,
    },
    duck,
    INITIAL_STATE,
  };
};

export default albumInfoDuck;
