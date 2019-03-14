// @flow
import type { DuckSpec, FSA, FSACreator } from '../declarations';

export const arraify = <S, A: Object>(spec: DuckSpec<S, A>): DuckSpec<
  S,
  $Exact<
    $ObjMap<
      A,
      (<P: Object, E>(FSACreator<P, E>) =>
      FSACreator<P, {| error: E |}>
      )
      >
    >
  > => {
  const forward = <P, E: Object>(state, action: FSA<P, E>) => {
    if (action.error) {
      return spec.reducer(
        state,
        ({
          ...action,
          payload: action.payload.error,
        }: any),
      );
    }
    return spec.reducer(state, action);
  };

  return ({
    ...spec,
    reducer: forward,
    actions: spec.actions,
  }: any);
};
