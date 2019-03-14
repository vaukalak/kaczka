// @flow
import { createDuck } from '../../src';
import type { DuckSpec, FSACreator } from '../../src';

export type UserInfoState = $Exact<{
  firstName: string,
  lastName: string,
}>;

const INITIAL_STATE = Object.freeze({ firstName: '', lastName: '' });

export type UserInfoActions = {
  setFirstName: FSACreator<{ firstName: string }, Error>,
  setLastName: FSACreator<{ lastName: string }, Error>,
}

const albumInfoDuck = (
  name: string,
): DuckSpec<UserInfoState, UserInfoActions> => {
  const duck = createDuck(name);

  const setFirstName = duck.defineAction('SET_FIRST_NAME');
  const setLastName = duck.defineAction('SET_LAST_NAME');

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
