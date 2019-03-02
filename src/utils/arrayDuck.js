// @flow
import { createDuck } from '..';
import type {
  FSA, ActionEnhancer, DuckSpec,
} from '..';

export type IndexedErrorPayload<P> = P & { error: Error };

const INITIAL_STATE = Object.freeze([]);

export type ArrayActionEnhancer<EntryActions, K> = ActionEnhancer<EntryActions,
  K,
  IndexedErrorPayload<K>>;

export type ArrayDuck<EntryState, EntryActions: Object, K> =
  DuckSpec<$ReadOnlyArray<EntryState>,
    ArrayActionEnhancer<EntryActions, K>>;

export const createArrayDuck = <EntryState, EntryActions, K: Object>(
  duckName: string,
  entryDuck: DuckSpec<EntryState, EntryActions>,
  indexProp: $Keys<K>,
): ArrayDuck<EntryState, EntryActions, K> => {
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
