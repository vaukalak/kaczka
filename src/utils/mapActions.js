// @flow
import type { DuckSpec } from '..';

export const mapAction = <S, A, B>(spec: DuckSpec<S, A>, mapper: (A) => B): DuckSpec<S, B> => ({
  ...spec,
  actions: mapper(spec.actions),
}: any);
