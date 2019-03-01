// @flow
import { createDuck } from '../../src';
import type { FSA, ActionEnhancer, SimpleDuck } from '../../src';

type IndexedPayload = { index: number };
type IndexedErrorPayload = IndexedPayload & { error: Error };

const INITIAL_STATE = Object.freeze([]);

const createArrayDuck = <EntryState, EntryActions>(
  duckName: string,
  entryDuck: SimpleDuck<EntryState, EntryActions>,
): SimpleDuck<$ReadOnlyArray<EntryState>,
  ActionEnhancer<EntryActions, IndexedPayload, IndexedErrorPayload>> => {
  const arrayDuck = createDuck(duckName);
  const reducer = arrayDuck.createReducer<$ReadOnlyArray<EntryState>>(INITIAL_STATE);

  const forward = <P: IndexedPayload, E: IndexedErrorPayload>(state, action: FSA<P, E>) => {
    const items = state.concat();
    const { index } = action.payload;
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

export default createArrayDuck;
