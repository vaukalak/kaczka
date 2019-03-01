// @flow
import { createDuck, ActionMatchers } from '../../src';

export type PhotoState = $Exact<{
  updatedAt?: string,
  label?: string,
  url?: string,
  errors: Array<string>,
}>;

const INITIAL_STATE = Object.freeze({ errors: [] });

const createPhotoDuck = () => {
  const photoDuck = createDuck('photos');

  const setPhoto = photoDuck.defineAction<{ url: string, updatedAt: string }, Error>('SET_PHOTO');
  const setLabel = photoDuck.defineAction<{ label: string, updatedAt: string }, Error>('SET_LABEL');

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
    actions: Object.freeze({
      setPhoto,
      setLabel,
    }),
    duck: photoDuck,
    INITIAL_STATE,
  };
};

export default createPhotoDuck;
