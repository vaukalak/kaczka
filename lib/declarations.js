// @flow

// actions

export type FSASuccess<P> = {| type: string, payload: P, error?: false |};
export type FSAError<E = Error> = {| type: string, payload: E, error: true |};
export type FSA<P, E = Error> = FSASuccess<P> | FSAError<E>;

// action creators

export type FSACreator<P, E = Error> = {
  (P | E, isError?: boolean): FSA<P, E>,
  ACTION_TYPE: string,
};

// reducers

export type FSAHandler<S, P, E = Error> = (S, FSA<P, E>) => S;
export type FSASuccessHandler<S, P> = (S, FSASuccess<P>) => S;
export type FSAErrorHandler<S, E = Error> = (S, FSAError<E>) => S;

export type FSAReducer<S> = {
  <P, E>(S, FSA<P, E>): S,
  withHandler: <P, E>(FSACreator<P, E>, FSAHandler<S, P, E>) => FSAReducer<S>,
  withSuccessHandler: <P, E>(FSACreator<P, E>, FSASuccessHandler<S, P>) => FSAReducer<S>,
  withErrorHandler: <P, E>(FSACreator<P, E>, FSAErrorHandler<S, E>) => FSAReducer<S>,
};
