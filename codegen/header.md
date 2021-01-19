# list-fns

[![npm version](https://img.shields.io/npm/v/list-fns)](https://npmjs.com/package/list-fns)
![](https://img.shields.io/badge/dependencies-zero-green)
![](https://img.shields.io/bundlephobia/min/list-fns)

This library contains higher order functions that simplify common list operations, similar to what you'd find in `lodash` or `ramda`. Unlike these libraries, `list-fns` is designed specifically to be used with the native array methods.

These functions have not been rigorously tested for performance so they are currently not recommended for use with large datasets.

**Example**

```js
import { byProperty, get, uniqueByProperty } from "list-fns";

const people = [
  { name: "Jack", age: 44 },
  { name: "Jack", age: 60 },
  { name: "Jane", age: 20 },
];

// Inline implementation:
people
  .filter(
    (person, index) => index === people.findIndex(p => p.name === person.name)
  )
  .sort((a, b) => (a.age < b.age ? -1 : a.age > b.age ? 1 : 0))
  .map(person => person.name); // ["Jane", "Jack"]

// With list functions:
people
  .filter(uniqueByProperty("name"))
  .sort(byProperty("age"))
  .map(get("name")); // ["Jane", "Jack"]
```

## Install

```
npm install list-fns
```

## A note about sorting

This library contains functions to be used with `[].sort()`. Always be mindful of the fact that `.sort()` and `.reverse()` will mutate the original list. If `.sort()` is the first method you're calling on a list you should probably clone it first in order to avoid unexpected behavior:

```js
[...list].sort();
list.slice().sort();
[].concat(list).sort();
```

## Functions
