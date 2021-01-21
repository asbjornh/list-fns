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

<details>
  <summary>Table of contents</summary>
  <ul>
    <li><a href="#by">by</a></li>
<li><a href="#byProperty">byProperty</a></li>
<li><a href="#byValue">byValue</a></li>
<li><a href="#countBy">countBy</a></li>
<li><a href="#duplicates">duplicates</a></li>
<li><a href="#duplicatesBy">duplicatesBy</a></li>
<li><a href="#duplicatesByProperty">duplicatesByProperty</a></li>
<li><a href="#exclude">exclude</a></li>
<li><a href="#excludeBy">excludeBy</a></li>
<li><a href="#excludeByProperty">excludeByProperty</a></li>
<li><a href="#get">get</a></li>
<li><a href="#groupBy">groupBy</a></li>
<li><a href="#groupByMany">groupByMany</a></li>
<li><a href="#groupByProperty">groupByProperty</a></li>
<li><a href="#has">has</a></li>
<li><a href="#intersection">intersection</a></li>
<li><a href="#intersectionBy">intersectionBy</a></li>
<li><a href="#intersectionByProperty">intersectionByProperty</a></li>
<li><a href="#is">is</a></li>
<li><a href="#isBy">isBy</a></li>
<li><a href="#isDefined">isDefined</a></li>
<li><a href="#isOneOf">isOneOf</a></li>
<li><a href="#isOneOfBy">isOneOfBy</a></li>
<li><a href="#isnt">isnt</a></li>
<li><a href="#isntBy">isntBy</a></li>
<li><a href="#isntOneOf">isntOneOf</a></li>
<li><a href="#isntOneOfBy">isntOneOfBy</a></li>
<li><a href="#max">max</a></li>
<li><a href="#maxBy">maxBy</a></li>
<li><a href="#maxByProperty">maxByProperty</a></li>
<li><a href="#min">min</a></li>
<li><a href="#minBy">minBy</a></li>
<li><a href="#minByProperty">minByProperty</a></li>
<li><a href="#or">or</a></li>
<li><a href="#partition">partition</a></li>
<li><a href="#propertyIs">propertyIs</a></li>
<li><a href="#propertyIsOneOf">propertyIsOneOf</a></li>
<li><a href="#propertyIsnt">propertyIsnt</a></li>
<li><a href="#propertyIsntOneOf">propertyIsntOneOf</a></li>
<li><a href="#sum">sum</a></li>
<li><a href="#sumBy">sumBy</a></li>
<li><a href="#sumByProperty">sumByProperty</a></li>
<li><a href="#unique">unique</a></li>
<li><a href="#uniqueBy">uniqueBy</a></li>
<li><a href="#uniqueByProperty">uniqueByProperty</a></li>
  </ul>
</details>

### <div id="by"></div> by


```ts
by: <T>(func: (el: T) => any) => (a: T, b: T) => 0 | 1 | -1
```


Use with: `sort` 

Sort the elements by `func(element)` . Supports sorting by boolean values (elements that are `true` first).

```ts
[{ a: 2 }, { a: 1 }].sort(by(el => el.a)); // Returns [{ a: 1 }, { a: 2 }]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const by = <T>(func: (el: T) => any) => (a: T, b: T) => {
  const A = func(a),
    B = func(b);
  if (typeof A === "boolean") return A && !B ? -1 : !A && B ? 1 : 0;
  return A < B ? -1 : A > B ? 1 : 0;
}
```

  <p>
</details>

### <div id="byProperty"></div> byProperty


```ts
byProperty: <TObject extends object, TKey extends keyof TObject>(key: TKey) => (a: TObject, b: TObject) => 0 | 1 | -1
```


Use with: `sort` 

Sort the elements by `element[key]` (can also be an array index). Supports sorting by boolean values (elements that are `true` first).

```ts
[{ a: 2 }, { a: 1 }].sort(byProperty('a')); // Returns [{ a: 1 }, { a: 2 }]
[["a", 2], ["a", 1]].sort(byProperty(1)); // Returns [["a", 1], ["a", 2]]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const byProperty = <TObject extends object, TKey extends keyof TObject>(
  key: TKey
) => by<TObject>(get(key))
```

  <p>
</details>

### <div id="byValue"></div> byValue


```ts
byValue: (a: number, b: number) => 0 | 1 | -1
```


Use with: `sort` 

Sort a list of numbers. This is useful because javascript sorts numbers as string, meaning that [25, 100] results in [100, 25] since "2" is greater than "1"

```ts
[100, 25].sort(); // Returns [100, 25]
[100, 25].sort(byValue); // Returns [25, 100]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const byValue = (a: number, b: number) => (a < b ? -1 : a > b ? 1 : 0)
```

  <p>
</details>

### <div id="countBy"></div> countBy


```ts
countBy: <T>(func: (el: T) => boolean) => (acc: number, el: T) => number
```


Use with: `reduce` 

Returns the number of times `func` returned `true` for the list elements. A number must be passed to the second argument of `reduce` . Can be combined with boolean-returning functions like `is` , `isnt` , `propertyIs` or `propertyIsOneOf` .

```ts
["a", "a", "b"].reduce(countBy(el => el === "a"), 0); // Returns 2
["a", "a", "b"].reduce(countBy(is("a")), 0); // Returns 2

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const countBy = <T>(func: (el: T) => boolean) => (acc: number, el: T) =>
  acc + (func(el) ? 1 : 0)
```

  <p>
</details>

### <div id="duplicates"></div> duplicates


```ts
duplicates: (el: unknown, _: number, list: unknown[]) => boolean
```


Use with: `filter` 

Returns duplicates

```ts
[1, 1, 1, 2].filter(duplicates); // Returns [1, 1, 1]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const duplicates = duplicatesBy(el => el)
```

  <p>
</details>

### <div id="duplicatesBy"></div> duplicatesBy


```ts
duplicatesBy: <T>(func: (el: T) => unknown) => (el: T, _: number, list: T[]) => boolean
```


Use with: `filter` 

Returns all duplicates compared by `func(element)` 

```ts
[{ a: 1 }, { a : 1 }, { a: 2 }].filter(duplicatesBy(el => el.a)); // Returns [{ a: 1 }, { a: 1 }]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const duplicatesBy = <T>(func: (el: T) => unknown) => (
  el: T,
  _: number,
  list: T[]
) => {
  let n = 0;
  for (let i = 0; i < list.length; i++) {
    if (n >= 2) return true;
    if (func(list[i]) === func(el)) n++;
  }
  return false;
}
```

  <p>
</details>

### <div id="duplicatesByProperty"></div> duplicatesByProperty


```ts
duplicatesByProperty: <TObject extends object, TKey extends keyof TObject>(key: TKey) => (el: TObject, _: number, list: TObject[]) => boolean
```


Use with: `filter` 

Returns duplicates compared by `element[key]` 

```ts
[{ a: 1 }, { a: 1 }].filter(duplicatesByProperty('a')); // Return [{ a: 1 }, { a: 1 }]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const duplicatesByProperty = <
  TObject extends object,
  TKey extends keyof TObject
>(
  key: TKey
) => duplicatesBy<TObject>(get(key))
```

  <p>
</details>

### <div id="exclude"></div> exclude


```ts
exclude: <T>(list: T[]) => (el: T) => boolean
```


Use with: `filter` 

Removes the provided elements from the list

```ts
[1, 2, 3, 4].filter(exclude([1, 2])); // Returns [3, 4]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const exclude = <T>(list: T[]) => (el: T) =>
  findIndex(list, a => a === el) === -1
```

  <p>
</details>

### <div id="excludeBy"></div> excludeBy


```ts
excludeBy: <T>(func: (el: T) => unknown, list: T[]) => (el: T) => boolean
```


Use with: `filter` 

Removes the provided elements from the list compared by running `func` on elements in both lists

```ts
[{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }]
  .filter(excludeBy(el => el.a, [{ a: 1 }, { a: 2 }]));
  // Returns [{ a: 3 }, { a: 4 }]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const excludeBy = <T>(func: (el: T) => unknown, list: T[]) => (el: T) =>
  findIndex(list, a => func(a) === func(el)) === -1
```

  <p>
</details>

### <div id="excludeByProperty"></div> excludeByProperty


```ts
excludeByProperty: <TObject extends object, TKey extends keyof TObject>(key: TKey, list: TObject[]) => (el: TObject) => boolean
```


Use with: `filter` 

Removes the provided elements from the list compared at `key` 

```ts
[{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }]
  .filter(excludeByProperty('a', [{ a: 1 }, { a: 2 }]));
  // Returns [{ a: 3 }, { a: 4 }]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const excludeByProperty = <
  TObject extends object,
  TKey extends keyof TObject
>(
  key: TKey,
  list: TObject[]
) => excludeBy(get(key), list)
```

  <p>
</details>

### <div id="get"></div> get


```ts
get: {
  <TObject extends object, TKey1 extends keyof TObject, TKey2 extends keyof TObject[TKey1], TKey3 extends keyof TObject[TKey1][TKey2]>(key1: TKey1, key2: TKey2, key3: TKey3): (obj: TObject) => TObject[TKey1][TKey2][TKey3];
  <TObject extends object, TKey1 extends keyof TObject, TKey2 extends keyof TObject[TKey1]>(key1...;
}
```


Use with `map` or `filter` 

Returns `element[key]` (can also be an array index). Supports up to three keys of depth.

```ts
[{ a: 1 }, { a: 2 }].map(get('a')); // Returns [1, 2]
[["a", 1], ["a", 2]].map(get(1)); // Returns [1, 2]
[{ a: { b: { c: 1 } } }].map(get('a', 'b', 'c')); // Returns [1]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
export function get<
  TObject extends object,
  TKey1 extends keyof TObject,
  TKey2 extends keyof TObject[TKey1],
  TKey3 extends keyof TObject[TKey1][TKey2]
>(key1: TKey1, key2?: TKey2, key3?: TKey3) {
  return (obj: TObject) => {
    if (key3 && key2)
      return obj && obj[key1] && obj[key1][key2] && obj[key1][key2][key3];
    if (key2) return obj && obj[key1] && obj[key1][key2];
    return obj && obj[key1];
  };
}
```

  <p>
</details>

### <div id="groupBy"></div> groupBy


```ts
groupBy: <K extends string, V>(func: (el: V) => K | undefined) => (acc: Record<K, V[]>, el: V) => Record<K, V[]>
```


Use with: `reduce` 

Given a key-returning function, returns the elements grouped in an object according to the returned keys. A second argument must be passed to `reduce` . For javascript an empty object is enough. For typescript an object with properties or a type cast may be required.

```ts
[{ age: 10 }, { age: 80 }].reduce(
  groupBy(el => (el.age > 30 ? "old" : "young")),
  { old: [], young: [] }
); // Returns { old: [{ age: 80 }], young: [{ age: 10 }]}

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const groupBy = <K extends string, V>(
  func: (el: V) => K | undefined
) => (acc: Record<K, V[]>, el: V): Record<K, V[]> => {
  const groupName = func(el);
  if (!groupName) return acc;
  if (!acc[groupName]) acc[groupName] = [];
  acc[groupName].push(el);
  return acc;
}
```

  <p>
</details>

### <div id="groupByMany"></div> groupByMany


```ts
groupByMany: <K extends string, V>(func: (el: V) => K[] | undefined) => (acc: Record<K, V[]>, el: V) => Record<K, V[]>
```


Use with: `reduce` 

Given a function `func` that returns a list of keys, returns an object containing the elements grouped by the returned keys. Unlike the `groupBy` function, elements can appear several times in this object. Good for grouping objects by properties that are arrays. An empty object must be passed as the second argument to `reduce` 

```ts
const b1: B = { items: ["a", "b"] };
const b2: B = { items: ["a"] };

[b1, b2].reduce(groupByMany(b => b.items), {});
// Returns { a: [{ items: ["a", "b"] }, { items: ["a"] }], b: [{ items: ["b"] }] }

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const groupByMany = <K extends string, V>(
  func: (el: V) => K[] | undefined
) => (acc: Record<K, V[]>, el: V): Record<K, V[]> => {
  const groupNames = func(el) || [];
  groupNames.forEach(key => {
    if (!acc[key]) acc[key] = [];
    acc[key].push(el);
  });
  return acc;
}
```

  <p>
</details>

### <div id="groupByProperty"></div> groupByProperty


```ts
groupByProperty: <K extends keyof V, V extends { [key: string]: any; }>(key: K) => (acc: Record<V[K], V[]>, el: V) => Record<V[K], V[]>
```


Use with: `reduce` 

Given a property name, returns an object containing the elements grouped by the values for that property. A second argument must be passed to `reduce` . For javascript an empty object is enough. For typescript an object with properties or a type cast may be required.

```ts
[{ name: "Jane" }, { name: "John" }].reduce(
  groupByProperty("name"),
  {}
); // Returns { Jane: [{ name: "Jane" }], John: [{ name: "John" }] }

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const groupByProperty = <
  K extends keyof V,
  V extends { [key: string]: any }
>(
  key: K
) => (acc: Record<V[K], V[]>, el: V): Record<V[K], V[]> => {
  const groupName = el[key];
  if (!groupName) return acc;
  if (!acc[groupName]) acc[groupName] = [];
  acc[groupName].push(el);
  return acc;
}
```

  <p>
</details>

### <div id="has"></div> has


```ts
has: <TObject extends object, TKey extends keyof TObject>(...keys: TKey[]) => (object: TObject) => object is TObject & HasProperties<TObject, TKey>
```


Use with: `find` , `filter` 

Returns `true` for elements where `element[key]` for all provided keys is defined. This is useful when properties are needed but optional in the element type.

Known limitations: Type inference doesn't always work when list elements have an inferred type.

```ts
type Person = { name?: string };
const people: Person[] = [{ name: "John" }, {}];
people.filter(has("name")); // Returns [{ name: "a" }]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const has = <TObject extends object, TKey extends keyof TObject>(
  ...keys: TKey[]
) => (object: TObject): object is TObject & HasProperties<TObject, TKey> =>
  keys.every(key => isDefined(object[key]))
```

  <p>
</details>

### <div id="intersection"></div> intersection


```ts
intersection: <T>(list: T[]) => (el: T) => boolean
```


Use with: `filter` 

Returns a list of elements that are present in both lists

```ts
[1, 2, 3].filter(intersection([2, 3, 4])); // Returns [2, 3]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const intersection = <T>(list: T[]) => (el: T) =>
  findIndex(list, a => a === el) !== -1
```

  <p>
</details>

### <div id="intersectionBy"></div> intersectionBy


```ts
intersectionBy: <T>(func: (el: T) => unknown, list: T[]) => (el: T) => boolean
```


Use with: `filter` 

Returns a list of elements that are present in both lists compared by running `func` on elements in both lists

```ts
[{ a: 1 }, { a: 2 }, { a: 3 }]
  .filter(intersectionBy(el => el.a, [{ a: 2 }, { a: 3 }, { a: 4 }]));
  // Returns [{ a: 2 }, { a: 3 }]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const intersectionBy = <T>(func: (el: T) => unknown, list: T[]) => (
  el: T
) => findIndex(list, a => func(a) === func(el)) !== -1
```

  <p>
</details>

### <div id="intersectionByProperty"></div> intersectionByProperty


```ts
intersectionByProperty: <TObject extends object, TKey extends keyof TObject>(key: TKey, list: TObject[]) => (el: TObject) => boolean
```


Use with: `filter` 

Returns a list of elements that are present in both lists compared at `key` 

```ts
[{ a: 1 }, { a: 2 }, { a: 3 }]
  .filter(intersectionByProperty("a", [{ a: 2 }, { a: 3 }, { a: 4 }]));
  // Returns [{ a: 2 }, { a: 3 }]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const intersectionByProperty = <
  TObject extends object,
  TKey extends keyof TObject
>(
  key: TKey,
  list: TObject[]
) => intersectionBy(get(key), list)
```

  <p>
</details>

### <div id="is"></div> is


```ts
is: <T>(value: T) => (el: T) => boolean
```


Use with: `find` , `filter` 

Returns `true` for elements that are equal to `value` 

```ts
[1,2,3].find(is(1)); // Returns 1
[1,1,2].filter(is(1)); // Returns [1, 1]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const is = <T>(value: T) => (el: T) => el === value
```

  <p>
</details>

### <div id="isBy"></div> isBy


```ts
isBy: <T, U>(func: (el: T) => U, value: U) => (el: T) => boolean
```


Use with: `find` , `filter` 

Returns `true` for elements where `func(element)` equals `value` 

```ts
[{ a: 1 }, { a: 2 }].find(isBy(el => el.a, 2)); // Returns { a: 2 }
[{ a: 1 }, { a: 2 }].filter(isBy(el => el.a, 2)); // Returns [{ a: 2 }]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const isBy = <T, U>(func: (el: T) => U, value: U) => (el: T) =>
  func(el) === value
```

  <p>
</details>

### <div id="isDefined"></div> isDefined


```ts
isDefined: <T>(x: T) => x is NonNullable<T>
```


Use with: `filter` 

Remove elements that are `undefined` or `null` 

```ts
[1, null, undefined, 2].filter(isDefined); // Returns [1, 2]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const isDefined = <T>(x: T): x is NonNullable<T> =>
  x !== undefined && x !== null
```

  <p>
</details>

### <div id="isOneOf"></div> isOneOf


```ts
isOneOf: <T>(list: T[]) => (el: T) => boolean
```


Use with: `find` , `filter` 

Alias for `intersection` . Returns `true` for elements that exist in the provided list

```ts
[1,1,2,2,3].filter(isOneOf([2,3])); // Returns [2, 2, 3]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const isOneOf = intersection
```

  <p>
</details>

### <div id="isOneOfBy"></div> isOneOfBy


```ts
isOneOfBy: <T, U>(func: (el: T) => U, list: U[]) => (el: T) => boolean
```


Use with: `find` , `filter` 

Returns `true` for elements where `func(element)` exists in `list` 

```ts
[{ a: 1 }, { a: 2 }, { a: 3 }].find(isOneOfBy(el => el.a, [2, 3]));
// ^ Returns { a: 2 }
[{ a: 1 }, { a: 2 }, { a: 3 }].filter(isOneOfBy(el => el.a, [2, 3]));
// ^ Returns [{ a: 2 }, { a: 3 }]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const isOneOfBy = <T, U>(func: (el: T) => U, list: U[]) => (el: T) =>
  findIndex(list, a => a === func(el)) !== -1
```

  <p>
</details>

### <div id="isnt"></div> isnt


```ts
isnt: <T>(value: T) => (el: T) => boolean
```


Use with: `find` , `filter` 

Returns `true` for elements that are not equal to `value` 

```ts
[1,2,3].find(isnt(1)); // Returns 2
[1,2,2].filter(isnt(1)); // Returns [2,2]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const isnt = <T>(value: T) => (el: T) => el !== value
```

  <p>
</details>

### <div id="isntBy"></div> isntBy


```ts
isntBy: <T, U>(func: (el: T) => U, value: U) => (el: T) => boolean
```


Use with: `find` , `filter` 

Returns `true` for elements where `func(element)` does not equal `value` 

```ts
[{ a: 1 }, { a: 2 }].find(isntBy(el => el.a, 2)); // Returns { a: 1 }
[{ a: 1 }, { a: 2 }].filter(isntBy(el => el.a, 2)); // Returns [{ a: 1 }]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const isntBy = <T, U>(func: (el: T) => U, value: U) => (el: T) =>
  func(el) !== value
```

  <p>
</details>

### <div id="isntOneOf"></div> isntOneOf


```ts
isntOneOf: <T>(list: T[]) => (el: T) => boolean
```


Use with: `find` , `filter` 

Alias for `exclude` . Returns `true` for elements that do not exist in the provided list

```ts
[1,1,2,2,3].filter(isntOneOf([2,3])); // Returns [1, 1]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const isntOneOf = exclude
```

  <p>
</details>

### <div id="isntOneOfBy"></div> isntOneOfBy


```ts
isntOneOfBy: <T, U>(func: (el: T) => U, list: U[]) => (el: T) => boolean
```


Use with: `find` , `filter` 

Returns `true` for elements where `func(element)` exists in `list` 

```ts
[{ a: 1 }, { a: 2 }, { a: 3 }].find(isntOneOfBy(el => el.a, [2, 3]));
// ^ Returns { a: 1 }
[{ a: 1 }, { a: 2 }, { a: 3 }].filter(isntOneOfBy(el => el.a, [2, 3]));
// ^ Returns [{ a: 1 }]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const isntOneOfBy = <T, U>(func: (el: T) => U, list: U[]) => (el: T) =>
  findIndex(list, a => a === func(el)) === -1
```

  <p>
</details>

### <div id="max"></div> max


```ts
max: (acc: number, el: number) => number
```


Use with: `reduce` 

Returns the largest value in the list

```ts
[1,2,3,4].reduce(max); // Returns 4

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const max = (acc: number, el: number) => Math.max(acc, el)
```

  <p>
</details>

### <div id="maxBy"></div> maxBy


```ts
maxBy: <T>(func: (el: T) => number) => (acc: T, el: T) => T
```


Use with: `reduce` 

Returns the largest element by comparing `func(element)` 

```ts
[{ a: 1 }, { a: 2 }, { a: 3 }].reduce(maxBy(el => el.a)); // Returns { a: 3 }

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const maxBy = <T>(func: (el: T) => number) => (acc: T, el: T) =>
  func(el) > func(acc) ? el : acc
```

  <p>
</details>

### <div id="maxByProperty"></div> maxByProperty


```ts
maxByProperty: <TObject extends object, TKey extends keyof TObject>(key: TKey) => (acc: TObject, el: TObject) => TObject
```


Use with: `reduce` 

Returns the largest element by comparing `element[key]` 

```ts
[{ a: 1 }, { a: 2 }, { a: 3 }].reduce(maxByProperty("a")); // Returns { a: 3 }

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const maxByProperty = <
  TObject extends object,
  TKey extends keyof TObject
>(
  key: TKey
) => (acc: TObject, el: TObject) => (el[key] > acc[key] ? el : acc)
```

  <p>
</details>

### <div id="min"></div> min


```ts
min: (acc: number, el: number) => number
```


Use with: `reduce` 

Returns the smallest value in the list

```ts
[1,2,3,4].reduce(min); // Returns 1

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const min = (acc: number, el: number) => Math.min(acc, el)
```

  <p>
</details>

### <div id="minBy"></div> minBy


```ts
minBy: <T>(func: (el: T) => number) => (acc: T, el: T) => T
```


Use with: `reduce` 

Returns the smallest element by comparing `func(element)` 

```ts
[{ a: 1 }, { a: 2 }, { a: 3 }].reduce(minBy(el => el.a)); // Returns { a: 1 }

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const minBy = <T>(func: (el: T) => number) => (acc: T, el: T) =>
  func(el) < func(acc) ? el : acc
```

  <p>
</details>

### <div id="minByProperty"></div> minByProperty


```ts
minByProperty: <TObject extends object, TKey extends keyof TObject>(key: TKey) => (acc: TObject, el: TObject) => TObject
```


Use with: `reduce` 

Returns the smallest element by comparing `element[key]` 

```ts
[{ a: 1 }, { a: 2 }, { a: 3 }].reduce(minByProperty("a")); // Returns { a: 1 }

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const minByProperty = <
  TObject extends object,
  TKey extends keyof TObject
>(
  key: TKey
) => (acc: TObject, el: TObject) => (el[key] < acc[key] ? el : acc)
```

  <p>
</details>

### <div id="or"></div> or


```ts
or: <T>(fallback: NonNullable<T>) => (x: T) => NonNullable<T>
```


Use with: `map` 

Replaces list elements that are `undefined` or `null` with `fallback` 

```ts
[1, null, undefined, 2].map(or(0)); // Returns [1, 0, 0, 2]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const or = <T>(fallback: NonNullable<T>) => (x: T): NonNullable<T> =>
  isDefined(x) ? x : fallback
```

  <p>
</details>

### <div id="partition"></div> partition


```ts
partition: <T>(func: (el: T) => boolean) => (acc: T[][], el: T) => T[][]
```


Use with: `reduce` 

Splits the input list into two lists. The first list contains elements for which the given function returned `true` , the second contains elements for which the function returned `false` .

```ts
[{ age: 10 }, { age: 80 }].reduce(partition(el => el.age > 30), []);
// Returns [[{ age: 80 }], [{ age: 10 }]]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const partition = <T>(func: (el: T) => boolean) => (
  acc: T[][],
  el: T
) => {
  const a0 = acc[0] || [],
    a1 = acc[1] || [];
  if (func(el)) a0.push(el);
  else a1.push(el);
  return [a0, a1];
}
```

  <p>
</details>

### <div id="propertyIs"></div> propertyIs


```ts
propertyIs: <TObject extends object, TKey extends keyof TObject>(key: TKey, value: TObject[TKey]) => (el: TObject) => boolean
```


Use with: `find` , `filter` 

Returns `true` for elements where `element[key]` equals `value` 

```ts
[{ a: 1 }, { a: 2 }].find(propertyIs("a", 2)); // Returns { a: 2 }
[{ a: 1 }, { a: 2 }].filter(propertyIs("a", 2)) // Returns [{ a: 2 }]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const propertyIs = <TObject extends object, TKey extends keyof TObject>(
  key: TKey,
  value: TObject[TKey]
) => isBy(get(key), value)
```

  <p>
</details>

### <div id="propertyIsOneOf"></div> propertyIsOneOf


```ts
propertyIsOneOf: <TObject extends object, TKey extends keyof TObject>(key: TKey, list: TObject[TKey][]) => (el: TObject) => boolean
```


Use with: `find` , `filter` 

Returns `true` for elements where `element[key]` exists in `list` 

```ts
[{ a: 1 }, { a: 2 }, { a: 3 }].find(propertyIsOneOf("a", [2, 3]));
// ^ Returns { a: 2 }
[{ a: 1 }, { a: 2 }, { a: 3 }].filter(propertyIsOneOf("a", [2, 3]));
// ^ Returns [{ a: 2 }, { a: 3 }]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const propertyIsOneOf = <
  TObject extends object,
  TKey extends keyof TObject
>(
  key: TKey,
  list: TObject[TKey][]
) => isOneOfBy(get(key), list)
```

  <p>
</details>

### <div id="propertyIsnt"></div> propertyIsnt


```ts
propertyIsnt: <TObject extends object, TKey extends keyof TObject>(key: TKey, value: TObject[TKey]) => (el: TObject) => boolean
```


Use with: `find` , `filter` 

Returns `true` for elements where `element[key]` does not equal `value` 

```ts
[{ a: 1 }, { a: 2 }].find(propertyIsnt("a", 2)); // Returns { a: 1 }
[{ a: 1 }, { a: 2 }].filter(propertyIsnt("a", 2)); // Returns [{ a: 1 }]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const propertyIsnt = <
  TObject extends object,
  TKey extends keyof TObject
>(
  key: TKey,
  value: TObject[TKey]
) => isntBy(get(key), value)
```

  <p>
</details>

### <div id="propertyIsntOneOf"></div> propertyIsntOneOf


```ts
propertyIsntOneOf: <TObject extends object, TKey extends keyof TObject>(key: TKey, list: TObject[TKey][]) => (el: TObject) => boolean
```


Use with: `find` , `filter` 

Returns `true` for elements where `element[key]` exists in `list` 

```ts
[{ a: 1 }, { a: 2 }, { a: 3 }].find(propertyIsntOneOf("a", [2, 3]));
// ^ Returns { a: 1 }
[{ a: 1 }, { a: 2 }, { a: 3 }].filter(propertyIsntOneOf("a", [2, 3]));
// ^ Returns [{ a: 1 }]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const propertyIsntOneOf = <
  TObject extends object,
  TKey extends keyof TObject
>(
  key: TKey,
  list: TObject[TKey][]
) => isntOneOfBy(get(key), list)
```

  <p>
</details>

### <div id="sum"></div> sum


```ts
sum: (acc: number, element: number) => number
```


Use with: `reduce` 

Sum a list of numbers

```ts
[1, 2, 3].reduce(sum); // Returns 6

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const sum = (acc: number, element: number) => acc + element
```

  <p>
</details>

### <div id="sumBy"></div> sumBy


```ts
sumBy: {
  <T>(func: (el: T) => number): (acc: number, el: T) => number;
  <T>(func: (el: number) => number): (acc: number, el: number) => number;
}
```


Use with: `reduce` 

Sums the values by applying `func` to elements. If the list elements aren't numbers, a number must be passed as the second argument to `reduce` .

```ts
[{ a: 1 }, { a: 2 }].reduce(sumBy(el => el.a), 0); // Returns 3
[1.5, 2.5].reduce(sumBy(Math.floor)); // Returns 3

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
export function sumBy<T>(func: (el: T | number) => number) {
  return (acc: number, el: T | number) =>
    typeof el === "number" ? func(acc) + func(el) : acc + func(el);
}
```

  <p>
</details>

### <div id="sumByProperty"></div> sumByProperty


```ts
sumByProperty: <TObject extends { [key: string]: number; }, TKey extends keyof TObject>(key: TKey) => (acc: number, el: TObject) => number
```


Use with: `reduce` 

Sums the values of `element[key]` for all elements. A number must be passed to the second argument of `reduce` .

```ts
[{ a: 1 }, { a: 2 }].reduce(sumByProperty('a'), 0); // Returns 3

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const sumByProperty = <
  TObject extends { [key: string]: number },
  TKey extends keyof TObject
>(
  key: TKey
) => (acc: number, el: TObject) => acc + el[key]
```

  <p>
</details>

### <div id="unique"></div> unique


```ts
unique: (el: unknown, index: number, list: unknown[]) => boolean
```


Use with: `filter` 

Removes duplicates from list

```ts
[1,1,1,2].filter(unique); // Returns [1, 2]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const unique = uniqueBy(el => el)
```

  <p>
</details>

### <div id="uniqueBy"></div> uniqueBy


```ts
uniqueBy: <T>(func: (el: T) => unknown) => (el: T, index: number, list: T[]) => boolean
```


Use with: `filter` 

Removes duplicates compared by `func(element)` 

```ts
[{ a: 1 }, { a : 1 }].filter(uniqueBy(el => el.a)); // Returns [{ a: 1 }]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const uniqueBy = <T>(func: (el: T) => unknown) => (
  el: T,
  index: number,
  list: T[]
) => index === findIndex(list, t => func(t) === func(el))
```

  <p>
</details>

### <div id="uniqueByProperty"></div> uniqueByProperty


```ts
uniqueByProperty: <TObject extends object, TKey extends keyof TObject>(key: TKey) => (el: TObject, index: number, list: TObject[]) => boolean
```


Use with: `filter` 

Removes duplicates compared by `element[key]` 

```ts
[{ a: 1 }, { a: 1 }].filter(uniqueByProperty('a')); // Return [{ a: 1 }]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const uniqueByProperty = <
  TObject extends object,
  TKey extends keyof TObject
>(
  key: TKey
) => uniqueBy<TObject>(get(key))
```

  <p>
</details>
