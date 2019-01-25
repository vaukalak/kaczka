// @flow

// actions

export type FSASuccess<P> = {| type: string, payload: P, error?: false |};
export type FSAError<E> = {| type: string, payload: E, error: true |};
export type FSA<P, E> = FSASuccess<P> | FSAError<E>;

// action creators

export type BaseFSACreator<P, E> = {
  (P | E, isError?: boolean): FSA<P, E>,
  ACTION_TYPE: string,
};


export type FSACreator<P> = BaseFSACreator<P, Error>;

// reducers

export type FSAHandler<S, P, E = Error> = (S, FSA<P, E>) => S;
export type FSASuccessHandler<S, P> = (S, FSASuccess<P>) => S;
export type FSAErrorHandler<S, E = Error> = (S, FSAError<E>) => S;

export type FSAReducer<S> = {
  <P, E>(S, FSA<P, E>): S,
  withHandler: <P, E>(BaseFSACreator<P, E>, FSAHandler<S, P, E>) => FSAReducer<S>,
  withSuccessHandler: <P, E>(BaseFSACreator<P, E>, FSASuccessHandler<S, P>) => FSAReducer<S>,
  withErrorHandler: <P, E>(BaseFSACreator<P, E>, FSAErrorHandler<S, E>) => FSAReducer<S>,
  withHandler: <P>(FSACreator<P>, FSAHandler<S, P, Error>) => FSAReducer<S>,
  withSuccessHandler: <P>(FSACreator<P>, FSASuccessHandler<S, P>) => FSAReducer<S>,
  withErrorHandler: <P>(FSACreator<P>, FSAErrorHandler<S, Error>) => FSAReducer<S>,
};
