// @flow
import { createDuck, ActionMatchers } from '../../lib';
import type { FSACreator, FSAReducer } from '../../lib';

export type PhotoState = $Exact<{
  updatedAt?: string,
  label?: string,
  url?: string,
  errors: Array<string>,
}>;

const INITIAL_STATE = Object.freeze({ errors: [] });

// TODO: remove explicit typing when https://github.com/facebook/flow/issues/7481 is resolved
type PhotoDuck<T, E = Error> = {
  reducer: FSAReducer<PhotoState>,
  actions: {
    setPhoto: FSACreator<{ url: string, updatedAt: string } & T, E>,
    setLabel: FSACreator<{ label: string, updatedAt: string } & T, E>,
  },
  INITIAL_STATE: typeof INITIAL_STATE,
};

const createPhotoDuck = <P, E>(parentDuck: string): PhotoDuck<P, E> => {
  const photoDuck = createDuck(`${parentDuck}/photos`);

  const setPhoto = photoDuck.defineAction('SET_PHOTO');
  const setLabel = photoDuck.defineAction('SET_LABEL');

  const reducer = photoDuck.createReducer<PhotoState>(INITIAL_STATE);

  reducer.withSuccessHandler(setPhoto, (state, { payload }) => ({
    ...state,
    errors: [],
    url: payload.url,
    updatedAt: payload.updatedAt,
  }));

  reducer.withSuccessHandler(
    setLabel,
    (state, { payload }) => ({
      ...state,
      label: payload.label,
      updatedAt: payload.updatedAt,
    }),
  );

  reducer.withErrorHandler(
    ActionMatchers.DEFAULT,
    (state, { payload }) => ({
      ...state,
      errors: [...state.errors, payload.message],
    }),
  );

  return {
    reducer,
    actions: {
      setPhoto,
      setLabel,
    },
    INITIAL_STATE,
  };
};

export default createPhotoDuck;
