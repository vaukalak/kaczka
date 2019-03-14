// @flow

// actions

export type FSASuccess<P> = {| type: string, payload: P, error?: false |};
export type FSAError<E> = {| type: string, payload: E, error: true |};
export type FSA<P, E> = FSASuccess<P> | FSAError<E>;

export const ActionMatchers = Object.freeze({
  NAMESPACE_DEFAULT: 'kaczka.NAMESPACE_DEFAULT', // TODO: implement behavior
  NAMESPACE: 'kaczka.NAMESPACE', // TODO: implement behavior
  DEFAULT: 'kaczka.DEFAULT',
});

export type ActionMatcherType = $Values<typeof ActionMatchers>;

// action creators

export type FSACreator<P, E> = {
  (payload: P, isError?: boolean): FSA<P, E>,
  (payload: Error, isError?: boolean): FSA<P, E>,
  (payload: E, isError: true): FSA<P, E>,
  actionType: string,
};

// reducers

export type FSAHandler<S, P, E = Error> = (S, FSA<P, E>) => S;
export type FSASuccessHandler<S, P> = (S, FSASuccess<P>) => S;
export type FSAErrorHandler<S, E = Error> = (S, FSAError<E>) => S;

export type FSAReducer<S> = {
  <P, E>(S, FSA<P, E>): S,
  // withHandler
  withHandler: (<P, E>(FSACreator<P, E>, FSAHandler<S, P, E>) => FSAReducer<S>) &
    (string, FSAHandler<S, any, any>) => FSAReducer<S>,
  withErrorHandler: (<P, E>(FSACreator<P, E>, FSAErrorHandler<S, E>) => FSAReducer<S>) &
    (string, FSAErrorHandler<S, any>) => FSAReducer<S>,
  withSuccessHandler: (<P, E>(FSACreator<P, E>, FSASuccessHandler<S, P>) => FSAReducer<S>) &
    (string, FSASuccessHandler<S, any>) => FSAReducer<S>,
};

export type Duck = {
  defineAction: <P, E>(baseType: string) => FSACreator<P, E>,
  createReducer: <S>(initialState: S) => FSAReducer<S>,
};


export type DuckSpec<S, Actions> = {|
  reducer: FSAReducer<S>,
  actions: Actions,
  INITIAL_STATE: S,
  duck?: Duck,
|};

// utils

type Actions<T: Object> = $Exact<$ElementType<T, 'actions'>>;

type MergeFn =
  & (<T0, T1, T2, T3, T4>(T0, T1, T2, T3, T4) =>
  { ...Actions<T0>, ...Actions<T1>, ...Actions<T2>, ...Actions<T3>, ...Actions<T4> })
  & (<T0, T1, T2, T3>(T0, T1, T2, T3) =>
  { ...Actions<T0>, ...Actions<T1>, ...Actions<T2>, ...Actions<T3> })
  & (<T0, T1, T2>(T0, T1, T2) => { ...Actions<T0>, ...Actions<T1>, ...Actions<T2> })
  & (<T0, T1>(T0, T1) => { ...Actions<T0>, ...Actions<T1> });

export type Merge<T0, T1, T2 = void, T3 = void, T4 = void, T5 = void> =
  $Call<MergeFn, T0, T1, T2, T3, T4, T5>;


export type ActionEnhancer<T, P, E> =
  $Exact<
    $ObjMap<
      T,
      (
        <P1, E1>(FSACreator<P1, E1>) =>
          FSACreator<
            {| ...$Exact<P1>, ...$Exact<P> |},
            {| ...$Exact<E1>, ...$Exact<E> |},
          >
      )
    >
  >;
