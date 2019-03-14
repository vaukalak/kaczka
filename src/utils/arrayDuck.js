// @flow
import { createDuck } from '..';
import type {
  FSA, DuckSpec, FSACreator,
} from '..';

const INITIAL_STATE = Object.freeze([]);

export const createArrayDuck = <Index: Object, EntryState, EntryActions>(
  duckName: string,
  entryDuck: DuckSpec<EntryState, EntryActions>,
  indexProp: $Keys<Index>,
): DuckSpec<
  $ReadOnlyArray<EntryState>,
  $Exact<
    $ObjMap<
      EntryActions,
      (<P1: Object, E1: Object>(FSACreator<P1, E1>) =>
        FSACreator<
          {| ...$Exact<P1>, ...$Exact<Index> |},
          {| ...$Exact<E1>, ...$Exact<Index> |},
        >
      )
    >
  >
> => {
  const arrayDuck = createDuck(duckName);
  const reducer = arrayDuck.createReducer<$ReadOnlyArray<EntryState>>(INITIAL_STATE);

  const forward = <P: Index, E: any>(state, action: FSA<P, E>) => {
    const items = state.concat();
    const { [indexProp]: index } = (action.payload: Index);
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
