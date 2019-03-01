// @flow
import createPhotoDuck, { type PhotoState } from './photoDuck';
import createArrayDuck from './arrayDuck';

const photoDuck = createPhotoDuck();

export const createPhotosListDuck = () => createArrayDuck<PhotoState, $Exact<typeof photoDuck.actions>>('album2', photoDuck);
