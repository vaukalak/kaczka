// @flow
export type FSA<P> = { type: string, payload: P, error: boolean };
export type FSACreator<P> = {
  (P): FSA<P>,
  ACTION_TYPE: string,
};
export type FSAHandler<S, P> = (S, FSA<P>) => S;
export type FSAReducer<S> = {
  <P>(S, FSA<P>): S,
  withHandler: <P>(FSACreator<P>, FSAHandler<S, P>) => FSAReducer<S>,
};
