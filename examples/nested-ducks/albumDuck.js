// @flow
import { createDuck } from '../../src';
import createPhotoDuck, { type PhotoState } from './photoDuck';
import type { FSA } from '../../src';

type IndexedPayload = { index: number };
type IndexedErrorPayload = IndexedPayload & { error: Error };

const INITIAL_STATE = Object.freeze({ photos: [], title: '' });

const photoDuck = createPhotoDuck<IndexedPayload, IndexedErrorPayload>('album');

export type AlbumState = {
  title: string,
  photos: Array<PhotoState>,
};

const createAlbumDuck = () => {
  const albumDuck = createDuck('album');
  const reducer = albumDuck.createReducer<AlbumState>(INITIAL_STATE);

  const forward = <P: IndexedPayload, E: IndexedErrorPayload>(state, action: FSA<P, E>) => {
    const photos = state.photos.concat();
    const { index } = action.payload;
    photos[index] = photoDuck.reducer(
      photos[index] || photoDuck.INITIAL_STATE,
      action,
    );
    return {
      ...state,
      photos,
    };
  };

  reducer.withHandler(
    photoDuck.actions.setPhoto,
    forward,
  );

  reducer.withHandler(
    photoDuck.actions.setLabel,
    forward,
  );

  return {
    reducer,
    actions: {
      ...photoDuck.actions,
    },
    INITIAL_STATE,
  };
};

export default createAlbumDuck;
