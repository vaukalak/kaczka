// @flow
import { createDuck } from '..';
import type {
  FSA, DuckSpec, FSACreator,
} from '..';

export type IndexedErrorPayload<P> = P & { error: Error };

const INITIAL_STATE = Object.freeze([]);

export const createArrayDuck = <K: Object, EntryState, EntryActions>(
  duckName: string,
  entryDuck: DuckSpec<EntryState, EntryActions>,
  indexProp: $Keys<K>,
): DuckSpec<$ReadOnlyArray<EntryState>,
  $Exact<$ObjMap<EntryActions,
    (<P1, E1>(FSACreator<P1, E1>) =>
      FSACreator<{| ...$Exact<P1>, ...$Exact<K> |},
        {| ...$Exact<E1>, ...$Exact<IndexedErrorPayload<K>> |}, >)>>> => {
  const arrayDuck = createDuck(duckName);
  const reducer = arrayDuck.createReducer<$ReadOnlyArray<EntryState>>(INITIAL_STATE);

  const forward = <P: K, E: IndexedErrorPayload<K>>(state, action: FSA<P, E>) => {
    const items = state.concat();
    const { [indexProp]: index } = (action.payload: K);
    items[index] = entryDuck.reducer(
      items[index] || entryDuck.INITIAL_STATE,
      action,
    );
    return items;
  };

  Object.values(entryDuck.actions).forEach(
    (action: any) => {
      reducer.withHandler(
        action,
        forward,
      );
    },
  );

  return {
    reducer,
    actions: {
      ...entryDuck.actions,
    },
    INITIAL_STATE,
    duck: arrayDuck,
  };
};
