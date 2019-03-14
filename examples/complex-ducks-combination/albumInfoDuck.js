// @flow
import { createDuck } from '../../src';
import type { DuckSpec, FSACreator } from '../../src';

export type AlbumInfoState = $Exact<{
  title: string,
  description: string,
}>;

const INITIAL_STATE = Object.freeze({ title: '', description: '' });

type AlbumInfoActions = {
  setTitle: FSACreator<{ title: string }, Error>,
  setDescription: FSACreator<{ description: string }, Error>,
};

const albumInfoDuck = (
  parentNamespace: string = '',
): DuckSpec<AlbumInfoState, AlbumInfoActions> => {
  const duck = createDuck(`${parentNamespace}/info`);

  const setTitle = duck.defineAction('SET_TITLE');
  const setDescription = duck.defineAction('SET_DESCRIPTION');

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
