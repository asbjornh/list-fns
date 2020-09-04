# list-fns

[![npm version](https://img.shields.io/npm/v/list-fns)](https://npmjs.com/package/list-fns)
![](https://img.shields.io/badge/dependencies-zero-green)
![](https://img.shields.io/bundlephobia/min/list-fns)

This library contains higher order functions for doing common list operations to enable a more declarative style when working with lists. File size is prioritized over performance (several of the functions are O(n^2)); this is not recommended for use with very large datasets.

**Example**

```js
import { byProperty, get, uniqueByProperty } from "list-fns";

const people = [
  { name: "Jack", age: 44 },
  { name: "Jack", age: 60 },
  { name: "Jane", age: 20 },
];

people
  .filter(
    (person, index) => index === people.findIndex(p => p.name === person.name)
  )
  .sort((a, b) => (a.age < b.age ? -1 : a.age > b.age ? 1 : 0))
  .map(person => person.name); // ["Jane", "Jack"]

people
  .filter(uniqueByProperty("name"))
  .sort(byProperty("age"))
  .map(get("name")); // ["Jane", "Jack"]
```

## Install

```
npm install list-fns
```

## Disclaimer about sorting

This library contains functions to be used with `[].sort()`. Always be mindful of the fact that `.sort()` and `.reverse()` will mutate the original list. If `.sort()` is the first method you're calling on a list you should probably clone it first in order to avoid unexpected behavior:

```js
[...list].sort();
list.slice().sort();
[].concat(list).sort();
```

## Functions
