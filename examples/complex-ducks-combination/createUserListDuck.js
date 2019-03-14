// @flow
import createPhotoDuck from './photoDuck';
import {
  createArrayDuck,
  combineDucks,
  mapAction,
} from '../../src/utils';
import albumInfoDuck from './albumInfoDuck';
import createUserInfoDuck from './userInfoDuck';
import type { Merge } from '../../src/declarations';

const createAvatarDuck = (name: string) => mapAction(
  createPhotoDuck(name),
  ({ setPhoto, setLabel }) => ({
    setAvatarPhoto: setPhoto,
    setAvatarLabel: setLabel,
  }),
);

const createPhotoListDuck = (name: string) => createArrayDuck<{ photoIndex: number }, _, _>(
  name,
  createPhotoDuck(`${name}/entry`),
  'photoIndex',
);

export const createAlbumDuck = (name: string = 'album') => {
  const photos = createPhotoListDuck(`${name}/photos`);
  const info = albumInfoDuck(`${name}/info`);
  return combineDucks<
    _,
    Merge<typeof photos, typeof info>,
  >(
    { photos, info },
  );
};

type DuckState<T> = $ElementType<$Call<T, ''>, 'INITIAL_STATE'>;

export const createAlbumListDuck = (name: string) => createArrayDuck<
  { albumIndex: number },
  DuckState<typeof createAlbumDuck>,
  _
>(
  name,
  createAlbumDuck(`${name}/entry`),
  'albumIndex',
);

const createUserDuck = (name: string) => {
  const avatar = createAvatarDuck(`${name}/avatar`);
  const albums = createAlbumListDuck(`${name}/albums`);
  const info = createUserInfoDuck(`${name}/info`);
  return combineDucks<
    *,
    Merge<typeof avatar, typeof info, typeof albums>,
  >(
    { avatar, albums, info },
  );
};

export const createUsersListDuck = (name: string = 'users') => createArrayDuck<
  { userIndex: number },
  DuckState<typeof createUserDuck>,
  _
>(
  name,
  createUserDuck(`${name}/entry`),
  'userIndex',
);
