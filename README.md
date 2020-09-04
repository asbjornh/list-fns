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

<details>
  <summary>Table of contents</summary>
  <ul>
    <li><a href="#by">by</a></li>
<li><a href="#byProperty">byProperty</a></li>
<li><a href="#countBy">countBy</a></li>
<li><a href="#duplicates">duplicates</a></li>
<li><a href="#duplicatesBy">duplicatesBy</a></li>
<li><a href="#duplicatesByProperty">duplicatesByProperty</a></li>
<li><a href="#exclude">exclude</a></li>
<li><a href="#excludeBy">excludeBy</a></li>
<li><a href="#excludeByProperty">excludeByProperty</a></li>
<li><a href="#get">get</a></li>
<li><a href="#groupBy">groupBy</a></li>
<li><a href="#intersection">intersection</a></li>
<li><a href="#intersectionBy">intersectionBy</a></li>
<li><a href="#intersectionByProperty">intersectionByProperty</a></li>
<li><a href="#isDefined">isDefined</a></li>
<li><a href="#max">max</a></li>
<li><a href="#maxBy">maxBy</a></li>
<li><a href="#maxByProperty">maxByProperty</a></li>
<li><a href="#min">min</a></li>
<li><a href="#minBy">minBy</a></li>
<li><a href="#minByProperty">minByProperty</a></li>
<li><a href="#partition">partition</a></li>
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

Sort the elements by the return values of the provided function. Supports sorting by boolean values (elements that are `true` first).

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

Sort the elements by the property value at the provided key (can also be an array index). Supports sorting by boolean values (elements that are `true` first).

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

### <div id="countBy"></div> countBy


```ts
countBy: <T>(func: (el: T) => boolean) => (acc: number, el: T) => number
```


Use with: `reduce` 

Counts the number of times `func` returned `true` for the list elements. A number must be passed to the second argument of `reduce` .

```ts
["a", "a", "b"].reduce(countBy(el => el === "a"), 0); // Returns 2

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

Returns all duplicates (compared by the provided function)

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
) => numberOfOccurencesBy(list, el, func) > 1
```

  <p>
</details>

### <div id="duplicatesByProperty"></div> duplicatesByProperty


```ts
duplicatesByProperty: <TObject extends object, TKey extends keyof TObject>(key: TKey) => (el: TObject, _: number, list: TObject[]) => boolean
```


Use with: `filter` 

Returns duplicates by comparing the `key` property of the elements

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

Removes the provided elements from the list compared by running `func` on each element

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

Returns the value at `key` (can also be an array index). Supports up to three keys of depth.

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
groupBy: <K extends string, V>(func: (el: V) => K) => (acc: Record<K, V[]>, el: V) => Record<K, V[]>
```


Use with: `reduce` 

Given a key-returning function, returns an object of lists of elements. A second argument must be passed to `reduce` . For javascript an empty object is enough. For typescript an object with properties or a type cast is required.

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
const groupBy = <K extends string, V>(func: (el: V) => K) => (
  acc: Record<K, V[]>,
  el: V
): Record<K, V[]> => {
  const groupName = func(el),
    group: V[] = acc[groupName] || [];
  return Object.assign({}, acc, { [groupName]: group.concat(el) });
}
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

Returns a list of elements that are present in both lists compared by running `func` on each element

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

### <div id="isDefined"></div> isDefined


```ts
isDefined: <T>(x: T | undefined) => x is T
```


Use with: `filter` 

Removes elements that are `undefined` 

```ts
[1, undefined, 2].filter(isDefined); // Returns [1, 2]

```


<details>
  <summary>Implementation</summary>
  <p>
    
```ts
const isDefined = <T>(x: T | undefined): x is T =>
  typeof x !== "undefined"
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

Returns the element that returned the largest value from `func` 

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

Returns the element that has the largest value at `key` 

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

Returns the element that returned the smallest value from `func` 

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

Returns the element that has the smallest value at `key` 

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
  return func(el) ? [a0.concat(el), a1] : [a0, a1.concat(el)];
}
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

Sums the values returned from the provided function. If the list elements aren't numbers, a number must be passed as the second argument to `reduce` .

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

Sums the values at `key` for all elements. A number must be passed to the second argument of `reduce` .

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

Removes duplicates by comparing elements according to the provided function

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

Removes duplicates by comparing the `key` property of the elements

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
