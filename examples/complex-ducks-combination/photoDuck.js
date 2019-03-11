// @flow
import { createDuck, ActionMatchers } from '../../src';
import type { DuckSpec } from '../../src';

export type PhotoState = $Exact<{
  updatedAt?: string,
  label?: string,
  url?: string,
  errors: Array<string>,
}>;

const INITIAL_STATE = Object.freeze({ errors: [] });

const createPhotoDuck = (name: string = 'photo'): DuckSpec<*, *> => {
  const photoDuck = createDuck(name);

  const actions = {
    setPhoto: photoDuck.defineAction('SET_PHOTO'),
    setLabel: photoDuck.defineAction('SET_LABEL'),
  };

  const reducer = photoDuck.createReducer<PhotoState>(INITIAL_STATE);

  reducer.withSuccessHandler(actions.setPhoto, (state, { payload }) => ({
    ...state,
    errors: [],
    url: payload.url,
    updatedAt: payload.updatedAt,
  }));

  reducer.withSuccessHandler(
    actions.setLabel,
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
    actions,
    duck: photoDuck,
    INITIAL_STATE,
  };
};

export default createPhotoDuck;
