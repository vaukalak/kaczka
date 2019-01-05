// @flow
import type {
  FSAError,
  FSASuccess,
  FSA, FSACreator,
} from '../lib/declarations';
import {
  createDuck,
} from '../lib';

// actions

const fooFsa: FSA<number> = { type: 'FOO', payload: 123, error: false };

if (fooFsa.error) {
  (fooFsa.payload: Error);
} else {
  (fooFsa.payload: number);
}

const fooFsaSuccess: FSASuccess<number> = { type: 'FOO', payload: 123 };

(fooFsaSuccess.payload: number);

const fooFsaError: FSAError<> = { type: 'FOO', payload: new Error(), error: true };

(fooFsaError.payload: Error);

const fooFsaErrorNumber: FSAError<number> = { type: 'FOO', payload: 123, error: true };

(fooFsaErrorNumber.payload: number);

// action creators

const duck = createDuck('type-check-duck');

const fooCreator: FSACreator<{ x: number }> = duck.defineAction('FOO');

fooCreator({ x: 123 });
fooCreator(new Error());

(fooCreator.ACTION_TYPE: string);


