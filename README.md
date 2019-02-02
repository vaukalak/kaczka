# Features

### Shortest ever action define syntax:

```
import { createDuck } from 'kaczka';
const duck = createDuck('define-action-test');
const foo = duck.defineAction('FOO');
const bar = duck.defineAction('BAR');
```
That's it! Now you can create reducer and map your actions:

```
const INITIAL_STATE = { x: 0 };
const reducer = duck.createReducer(INITIAL_STATE);
reducer.withHandler(foo, s => s));
reducer.withHandler(bar, s => s);
```

Note: when you define an action, there's an internal property `actionType` added to the action creator
function. Which makes the magic possible.

Also you can import a special constant `ActionMatchers` to match actions by a pattern:

```
import { createDuck, ActionMatchers } from 'kaczka';
reducer.withHandler(ActionMatchers.DEFAULT, s => s);
```

Right now the only supported matcher is `DEFAULT`, which allows you to handle all unmatched actions (as `default` case in plane `swith/case` reducer).

### Short and and consistent typing syntax

```
// flow
import { createDuck } from 'kaczka';

const duck = createDuck('define-action-test');
const foo = duck.defineAction<{ x: number }, Error>('FOO');
```

`kaczka` enforces FSA convention, for that reason you should add type for both success and error payload to your actions. Also `flow` will warn you
when you have not handled error case in your reducer:
```
const INITIAL_STATE = { x: 0, events: [] };
const reducer = duck.createReducer<typeof INITIAL_STATE>(INITIAL_STATE);
reducer.withHandler(foo, (state, action) => ({
  ...state,
  x: action.payload.x, // Error doesn't have field `x`
}));
```

To make it pass typecheck, you need to check if it's an error action:

```
const INITIAL_STATE = { x: 0 };
const reducer = duck.createReducer<typeof INITIAL_STATE>(INITIAL_STATE);
reducer.withHandler(foo, (state, action) => (action.error ? {
  ...state,
  events: [...state.events, action.payload.message],
} : {
  ...state,
  x: action.payload.x,
}));
```

However, you may want to add a handler for positive case only, you need to use method `withSuccessHandler`:
```
const INITIAL_STATE = { x: 0 };
const reducer = duck.createReducer<typeof INITIAL_STATE>(INITIAL_STATE);
reducer.withSuccessHandler(foo, (state, action) => ({
  ...state,
  x: action.payload.x,
}));
```
There's also method `withErrorHandler`, may be handy for example to log all errors, together with `ActionMatchers`:
```
const INITIAL_STATE = { x: 0 };
const reducer = duck.createReducer<typeof INITIAL_STATE>(INITIAL_STATE);
reducer.withErrorHandler(ActionMatchers.DEFAULT, (state, action) => ({
  ...state,
  events: [...state.events, action.payload.message],
}));
```

You can stop typing your handlers additionally, with `kaczka` both action creator, and reducer handlers, will be inferred
from the action definition. Also you will never forget to `...state`, or other shape related errors, thanks to typing inference.

# Installation

```
yarn add kaczka
```
or
```
npm i -S kaczka
```

# P.S.

```
'kaczka' === toLatineLetters(translateToBelarus('duck'));
```
