// @flow
import { createDuck } from '../../src';
import type { DuckSpec } from '../../src';

export type UserInfoState = $Exact<{
  firstName: string,
  lastName: string,
}>;

const INITIAL_STATE = Object.freeze({ firstName: '', lastName: '' });

const albumInfoDuck = (
  name: string,
): DuckSpec<*, *> => {
  const duck = createDuck(name);

  const setFirstName = duck.defineAction<{ firstName: string }, Error>('SET_FIRST_NAME');
  const setLastName = duck.defineAction<{ lastName: string }, Error>('SET_LAST_NAME');

  const reducer = duck.createReducer<UserInfoState>(INITIAL_STATE);

  reducer.withSuccessHandler(
    setFirstName,
    (state, { payload }) => ({
      ...state,
      firstName: payload.firstName,
    }),
  );

  reducer.withSuccessHandler(
    setLastName,
    (state, { payload }) => ({
      ...state,
      lastName: payload.lastName,
    }),
  );

  return {
    reducer,
    actions: {
      setFirstName,
      setLastName,
    },
    duck,
    INITIAL_STATE,
  };
};

export default albumInfoDuck;
