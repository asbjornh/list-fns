type SetNonNullable<T, Keys extends keyof T> = {
  [p in keyof T]: p extends Keys ? NonNullable<T[p]> : T[p];
};

/** Sets the properties to both required and non nullable */
type HasProperties<O, K extends keyof O> = SetNonNullable<O, K> &
  Required<Pick<O, K>> extends infer I
  ? { [k in keyof I]: I[k] }
  : never;

/** Use with: `filter`
 * 
 * Remove elements that are `undefined` or `null`
```ts
[1, null, undefined, 2].filter(isDefined); // Returns [1, 2]
```
 */
export const isDefined = <T>(x: T): x is NonNullable<T> =>
  x !== undefined && x !== null;

/** Use with: `map`
 * 
 * Replaces list elements that are `undefined` or `null` with `fallback`
```ts
[1, null, undefined, 2].map(or(0)); // Returns [1, 0, 0, 2]
```
 */
export const or = <T>(fallback: NonNullable<T>) => (x: T): NonNullable<T> =>
  isDefined(x) ? x : fallback;

const findIndex = <T>(list: T[], pred: (a: T) => boolean) => {
  for (let i = 0; i < list.length; i++) {
    if (pred(list[i])) return i;
  }
  return -1;
};

/** Use with: `filter`
 * 
 * Returns all duplicates compared by `func(element)`
```ts
[{ a: 1 }, { a : 1 }, { a: 2 }].filter(duplicatesBy(el => el.a)); // Returns [{ a: 1 }, { a: 1 }]
```
 */
export const duplicatesBy = <T>(func: (el: T) => unknown) => (
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
};

/** Use with: `filter`
 * 
 * Returns duplicates
```ts
[1, 1, 1, 2].filter(duplicates); // Returns [1, 1, 1]
```
 */
export const duplicates = duplicatesBy(el => el);

/** Use with: `filter`
 *
 * Returns duplicates compared by `element[key]`
```ts
[{ a: 1 }, { a: 1 }].filter(duplicatesByProperty('a')); // Return [{ a: 1 }, { a: 1 }]
```
 */
export const duplicatesByProperty = <
  TObject extends object,
  TKey extends keyof TObject
>(
  key: TKey
) => duplicatesBy<TObject>(get(key));

/** Use with: `filter`
 * 
 * Removes duplicates compared by `func(element)`
```ts
[{ a: 1 }, { a : 1 }].filter(uniqueBy(el => el.a)); // Returns [{ a: 1 }]
```
 */
export const uniqueBy = <T>(func: (el: T) => unknown) => (
  el: T,
  index: number,
  list: T[]
) => index === findIndex(list, t => func(t) === func(el));

/** Use with: `filter`
 * 
 * Removes duplicates from list
```ts
[1,1,1,2].filter(unique); // Returns [1, 2]
```
 */
export const unique = uniqueBy(el => el);

/** Use with: `filter`
 *
 * Removes duplicates compared by `element[key]`
```ts
[{ a: 1 }, { a: 1 }].filter(uniqueByProperty('a')); // Return [{ a: 1 }]
```
 */
export const uniqueByProperty = <
  TObject extends object,
  TKey extends keyof TObject
>(
  key: TKey
) => uniqueBy<TObject>(get(key));

/** Use with: `find`, `filter`
 *
 * Returns `true` for elements that are equal to `value`
```ts
[1,2,3].find(is(1)); // Returns 1
[1,1,2].filter(is(1)); // Returns [1, 1]
```
 */
export const is = <T>(value: T) => (el: T) => el === value;

/** Use with: `find`, `filter`
 *
 * Returns `true` for elements where `func(element)` equals `value`
```ts
[{ a: 1 }, { a: 2 }].find(isBy(el => el.a, 2)); // Returns { a: 2 }
[{ a: 1 }, { a: 2 }].filter(isBy(el => el.a, 2)); // Returns [{ a: 2 }]
```
 */
export const isBy = <T, U>(func: (el: T) => U, value: U) => (el: T) =>
  func(el) === value;

/** Use with: `find`, `filter`
 *
 * Returns `true` for elements where `element[key]` equals `value`
```ts
[{ a: 1 }, { a: 2 }].find(propertyIs("a", 2)); // Returns { a: 2 }
[{ a: 1 }, { a: 2 }].filter(propertyIs("a", 2)) // Returns [{ a: 2 }]
```
 */
export const propertyIs = <TObject extends object, TKey extends keyof TObject>(
  key: TKey,
  value: TObject[TKey]
) => isBy(get(key), value);

/** Use with: `find`, `filter`
 *
 * Returns `true` for elements that are not equal to `value`
```ts
[1,2,3].find(isnt(1)); // Returns 2
[1,2,2].filter(isnt(1)); // Returns [2,2]
```
 */
export const isnt = <T>(value: T) => (el: T) => el !== value;

/** Use with: `find`, `filter`
 *
 * Returns `true` for elements where `func(element)` does not equal `value`
```ts
[{ a: 1 }, { a: 2 }].find(isntBy(el => el.a, 2)); // Returns { a: 1 }
[{ a: 1 }, { a: 2 }].filter(isntBy(el => el.a, 2)); // Returns [{ a: 1 }]
```
 */
export const isntBy = <T, U>(func: (el: T) => U, value: U) => (el: T) =>
  func(el) !== value;

/** Use with: `find`, `filter`
 *
 * Returns `true` for elements where `element[key]` does not equal `value`
```ts
[{ a: 1 }, { a: 2 }].find(propertyIsnt("a", 2)); // Returns { a: 1 }
[{ a: 1 }, { a: 2 }].filter(propertyIsnt("a", 2)); // Returns [{ a: 1 }]
```
 */
export const propertyIsnt = <
  TObject extends object,
  TKey extends keyof TObject
>(
  key: TKey,
  value: TObject[TKey]
) => isntBy(get(key), value);

/**
 * Use with: `find`, `filter`
 *
 * Returns `true` for elements where `element[key]` for all provided keys is defined. This is useful when properties are needed but optional in the element type.
 *
 * Known limitations: Type inference doesn't always work when list elements have an inferred type.
```ts
type Person = { name?: string };
const people: Person[] = [{ name: "John" }, {}];
people.filter(has("name")); // Returns [{ name: "a" }]
```
 */
export const has = <TObject extends object, TKey extends keyof TObject>(
  ...keys: TKey[]
) => (object: TObject): object is TObject & HasProperties<TObject, TKey> =>
  keys.every(key => isDefined(object[key]));

/** Use with: `filter`
 *
 * Returns a list of elements that are present in both lists
```ts
[1, 2, 3].filter(intersection([2, 3, 4])); // Returns [2, 3]
```
 */
export const intersection = <T>(list: T[]) => (el: T) =>
  findIndex(list, a => a === el) !== -1;

/** Use with: `filter`
 *
 * Returns a list of elements that are present in both lists compared by running `func` on elements in both lists
```ts
[{ a: 1 }, { a: 2 }, { a: 3 }]
  .filter(intersectionBy(el => el.a, [{ a: 2 }, { a: 3 }, { a: 4 }]));
  // Returns [{ a: 2 }, { a: 3 }]
```
 */
export const intersectionBy = <T>(func: (el: T) => unknown, list: T[]) => (
  el: T
) => findIndex(list, a => func(a) === func(el)) !== -1;

/** Use with: `filter`
 *
 * Returns a list of elements that are present in both lists compared at `key`
```ts
[{ a: 1 }, { a: 2 }, { a: 3 }]
  .filter(intersectionByProperty("a", [{ a: 2 }, { a: 3 }, { a: 4 }]));
  // Returns [{ a: 2 }, { a: 3 }]
```
 */
export const intersectionByProperty = <
  TObject extends object,
  TKey extends keyof TObject
>(
  key: TKey,
  list: TObject[]
) => intersectionBy(get(key), list);

/**Use with: `find`, `filter`
 * 
 * Alias for `intersection`. Returns `true` for elements that exist in the provided list
```ts
[1,1,2,2,3].filter(isOneOf([2,3])); // Returns [2, 2, 3]
```
*/
export const isOneOf = intersection;

/** Use with: `find`, `filter`
 *
 * Returns `true` for elements where `func(element)` exists in `list`
```ts
[{ a: 1 }, { a: 2 }, { a: 3 }].find(isOneOfBy(el => el.a, [2, 3]));
// ^ Returns { a: 2 }
[{ a: 1 }, { a: 2 }, { a: 3 }].filter(isOneOfBy(el => el.a, [2, 3]));
// ^ Returns [{ a: 2 }, { a: 3 }]
```
 */
export const isOneOfBy = <T, U>(func: (el: T) => U, list: U[]) => (el: T) =>
  findIndex(list, a => a === func(el)) !== -1;

/** Use with: `find`, `filter`
 * 
 * Returns `true` for elements where `element[key]` exists in `list`
```ts
[{ a: 1 }, { a: 2 }, { a: 3 }].find(propertyIsOneOf("a", [2, 3]));
// ^ Returns { a: 2 }
[{ a: 1 }, { a: 2 }, { a: 3 }].filter(propertyIsOneOf("a", [2, 3]));
// ^ Returns [{ a: 2 }, { a: 3 }]
```
 */
export const propertyIsOneOf = <
  TObject extends object,
  TKey extends keyof TObject
>(
  key: TKey,
  list: TObject[TKey][]
) => isOneOfBy(get(key), list);

/** Use with: `filter`
 * 
 * Removes the provided elements from the list
```ts
[1, 2, 3, 4].filter(exclude([1, 2])); // Returns [3, 4]
```
 */
export const exclude = <T>(list: T[]) => (el: T) =>
  findIndex(list, a => a === el) === -1;

/** Use with: `filter`
 * 
 * Removes the provided elements from the list compared by running `func` on elements in both lists
```ts
[{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }]
  .filter(excludeBy(el => el.a, [{ a: 1 }, { a: 2 }]));
  // Returns [{ a: 3 }, { a: 4 }]
```
 */
export const excludeBy = <T>(func: (el: T) => unknown, list: T[]) => (el: T) =>
  findIndex(list, a => func(a) === func(el)) === -1;

/** Use with: `filter`
 * 
 * Removes the provided elements from the list compared at `key`
```ts
[{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }]
  .filter(excludeByProperty('a', [{ a: 1 }, { a: 2 }]));
  // Returns [{ a: 3 }, { a: 4 }]
```
 */
export const excludeByProperty = <
  TObject extends object,
  TKey extends keyof TObject
>(
  key: TKey,
  list: TObject[]
) => excludeBy(get(key), list);

/**Use with: `find`, `filter`
 * 
 * Alias for `exclude`. Returns `true` for elements that do not exist in the provided list
```ts
[1,1,2,2,3].filter(isntOneOf([2,3])); // Returns [1, 1]
```
*/
export const isntOneOf = exclude;

/** Use with: `find`, `filter`
 *
 * Returns `true` for elements where `func(element)` exists in `list`
```ts
[{ a: 1 }, { a: 2 }, { a: 3 }].find(isntOneOfBy(el => el.a, [2, 3]));
// ^ Returns { a: 1 }
[{ a: 1 }, { a: 2 }, { a: 3 }].filter(isntOneOfBy(el => el.a, [2, 3]));
// ^ Returns [{ a: 1 }]
```
 */
export const isntOneOfBy = <T, U>(func: (el: T) => U, list: U[]) => (el: T) =>
  findIndex(list, a => a === func(el)) === -1;

/** Use with: `find`, `filter`
 * 
 * Returns `true` for elements where `element[key]` exists in `list`
```ts
[{ a: 1 }, { a: 2 }, { a: 3 }].find(propertyIsntOneOf("a", [2, 3]));
// ^ Returns { a: 1 }
[{ a: 1 }, { a: 2 }, { a: 3 }].filter(propertyIsntOneOf("a", [2, 3]));
// ^ Returns [{ a: 1 }]
```
 */
export const propertyIsntOneOf = <
  TObject extends object,
  TKey extends keyof TObject
>(
  key: TKey,
  list: TObject[TKey][]
) => isntOneOfBy(get(key), list);

/** Use with: `sort`
 * 
 * Sort the elements by `func(element)`. Supports sorting by boolean values (elements that are `true` first).
```ts
[{ a: 2 }, { a: 1 }].sort(by(el => el.a)); // Returns [{ a: 1 }, { a: 2 }]
```
*/
export const by = <T>(func: (el: T) => any) => (a: T, b: T) => {
  const A = func(a),
    B = func(b);
  if (typeof A === "boolean") return A && !B ? -1 : !A && B ? 1 : 0;
  return A < B ? -1 : A > B ? 1 : 0;
};

/** Use with: `sort`
 * 
 * Sort a list of numbers. This is useful because javascript sorts numbers as string, meaning that [25, 100] results in [100, 25] since "2" is greater than "1"
```ts
[100, 25].sort(); // Returns [100, 25]
[100, 25].sort(byValue); // Returns [25, 100]
```
*/
export const byValue = (a: number, b: number) => (a < b ? -1 : a > b ? 1 : 0);

/** Use with: `sort`
 *
 * Sort the elements by `element[key]` (can also be an array index). Supports sorting by boolean values (elements that are `true` first).
```ts
[{ a: 2 }, { a: 1 }].sort(byProperty('a')); // Returns [{ a: 1 }, { a: 2 }]
[["a", 2], ["a", 1]].sort(byProperty(1)); // Returns [["a", 1], ["a", 2]]
```
 */
export const byProperty = <TObject extends object, TKey extends keyof TObject>(
  key: TKey
) => by<TObject>(get(key));

/** Use with `map` or `filter`
 * 
 * Returns `element[key]` (can also be an array index). Supports up to three keys of depth.
```ts
[{ a: 1 }, { a: 2 }].map(get('a')); // Returns [1, 2]
[["a", 1], ["a", 2]].map(get(1)); // Returns [1, 2]
[{ a: { b: { c: 1 } } }].map(get('a', 'b', 'c')); // Returns [1]
```
*/
export function get<
  TObject extends object,
  TKey1 extends keyof TObject,
  TKey2 extends keyof TObject[TKey1],
  TKey3 extends keyof TObject[TKey1][TKey2]
>(
  key1: TKey1,
  key2: TKey2,
  key3: TKey3
): (obj: TObject) => TObject[TKey1][TKey2][TKey3];
export function get<
  TObject extends object,
  TKey1 extends keyof TObject,
  TKey2 extends keyof TObject[TKey1]
>(key1: TKey1, key2: TKey2): (obj: TObject) => TObject[TKey1][TKey2];
export function get<TObject extends object, TKey extends keyof TObject>(
  key: TKey
): (obj: TObject) => TObject[TKey];
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

/** Use with: `reduce`
 * 
 * Sum a list of numbers
```ts
[1, 2, 3].reduce(sum); // Returns 6
```
 */
export const sum = (acc: number, element: number) => acc + element;

/** Use with: `reduce`
 * 
 * Sums the values by applying `func` to elements. If the list elements aren't numbers, a number must be passed as the second argument to `reduce`.
```ts
[{ a: 1 }, { a: 2 }].reduce(sumBy(el => el.a), 0); // Returns 3
[1.5, 2.5].reduce(sumBy(Math.floor)); // Returns 3
```
 */
export function sumBy<T>(
  func: (el: T) => number
): (acc: number, el: T) => number;
export function sumBy<T>(
  func: (el: number) => number
): (acc: number, el: number) => number;
export function sumBy<T>(func: (el: T | number) => number) {
  return (acc: number, el: T | number) =>
    typeof el === "number" ? func(acc) + func(el) : acc + func(el);
}

/** Use with: `reduce`
 *
 * Sums the values of `element[key]` for all elements. A number must be passed to the second argument of `reduce`.
```ts
[{ a: 1 }, { a: 2 }].reduce(sumByProperty('a'), 0); // Returns 3
```
 */
export const sumByProperty = <
  TObject extends { [key: string]: number },
  TKey extends keyof TObject
>(
  key: TKey
) => (acc: number, el: TObject) => acc + el[key];

/** Use with: `reduce`
 * 
 * Returns the largest value in the list
```ts
[1,2,3,4].reduce(max); // Returns 4
```
*/
export const max = (acc: number, el: number) => Math.max(acc, el);

/** Use with: `reduce`
 * 
 * Returns the largest element by comparing `func(element)`
```ts
[{ a: 1 }, { a: 2 }, { a: 3 }].reduce(maxBy(el => el.a)); // Returns { a: 3 }
```
*/
export const maxBy = <T>(func: (el: T) => number) => (acc: T, el: T) =>
  func(el) > func(acc) ? el : acc;

/** Use with: `reduce`
 * 
 * Returns the largest element by comparing `element[key]`
```ts
[{ a: 1 }, { a: 2 }, { a: 3 }].reduce(maxByProperty("a")); // Returns { a: 3 }
```
*/
export const maxByProperty = <
  TObject extends object,
  TKey extends keyof TObject
>(
  key: TKey
) => (acc: TObject, el: TObject) => (el[key] > acc[key] ? el : acc);

/** Use with: `reduce`
 * 
 * Returns the smallest value in the list
```ts
[1,2,3,4].reduce(min); // Returns 1
```
*/
export const min = (acc: number, el: number) => Math.min(acc, el);

/** Use with: `reduce`
 * 
 * Returns the smallest element by comparing `func(element)`
```ts
[{ a: 1 }, { a: 2 }, { a: 3 }].reduce(minBy(el => el.a)); // Returns { a: 1 }
```
*/
export const minBy = <T>(func: (el: T) => number) => (acc: T, el: T) =>
  func(el) < func(acc) ? el : acc;

/** Use with: `reduce`
 * 
 * Returns the smallest element by comparing `element[key]`
```ts
[{ a: 1 }, { a: 2 }, { a: 3 }].reduce(minByProperty("a")); // Returns { a: 1 }
```
*/
export const minByProperty = <
  TObject extends object,
  TKey extends keyof TObject
>(
  key: TKey
) => (acc: TObject, el: TObject) => (el[key] < acc[key] ? el : acc);

/** Use with: `reduce`
 *
 * Given a key-returning function, returns the elements grouped in an object according to the returned keys. A second argument must be passed to `reduce`. For javascript an empty object is enough. For typescript an object with properties or a type cast may be required.
```ts
[{ age: 10 }, { age: 80 }].reduce(
  groupBy(el => (el.age > 30 ? "old" : "young")),
  { old: [], young: [] }
); // Returns { old: [{ age: 80 }], young: [{ age: 10 }]}
```
 */
export const groupBy = <K extends string, V>(
  func: (el: V) => K | undefined
) => (acc: Record<K, V[]>, el: V): Record<K, V[]> => {
  const groupName = func(el);
  if (!groupName) return acc;
  if (!acc[groupName]) acc[groupName] = [];
  acc[groupName].push(el);
  return acc;
};

/** Use with: `reduce`
 *
 * Given a function `func` that returns a list of keys, returns an object containing the elements grouped by the returned keys. Unlike the `groupBy` function, elements can appear several times in this object. Good for grouping objects by properties that are arrays. An empty object must be passed as the second argument to `reduce`
```ts
const b1: B = { items: ["a", "b"] };
const b2: B = { items: ["a"] };

[b1, b2].reduce(groupByMany(b => b.items), {});
// Returns { a: [{ items: ["a", "b"] }, { items: ["a"] }], b: [{ items: ["b"] }] }
```
 */
export const groupByMany = <K extends string, V>(
  func: (el: V) => K[] | undefined
) => (acc: Record<K, V[]>, el: V): Record<K, V[]> => {
  const groupNames = func(el) || [];
  groupNames.forEach(key => {
    if (!acc[key]) acc[key] = [];
    acc[key].push(el);
  });
  return acc;
};

/** Use with: `reduce`
 *
 * Given a property name, returns an object containing the elements grouped by the values for that property. A second argument must be passed to `reduce`. For javascript an empty object is enough. For typescript an object with properties or a type cast may be required.
```ts
[{ name: "Jane" }, { name: "John" }].reduce(
  groupByProperty("name"),
  {}
); // Returns { Jane: [{ name: "Jane" }], John: [{ name: "John" }] }
```
 */
export const groupByProperty = <
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
};

/** Use with: `reduce`
 *
 * Splits the input list into two lists. The first list contains elements for which the given function returned `true`, the second contains elements for which the function returned `false`. 
```ts
[{ age: 10 }, { age: 80 }].reduce(partition(el => el.age > 30), []);
// Returns [[{ age: 80 }], [{ age: 10 }]]
```
 */
export const partition = <T>(func: (el: T) => boolean) => (
  acc: T[][],
  el: T
) => {
  const a0 = acc[0] || [],
    a1 = acc[1] || [];
  if (func(el)) a0.push(el);
  else a1.push(el);
  return [a0, a1];
};

/** Use with: `reduce`
 *
 * Returns the number of times `func` returned `true` for the list elements. A number must be passed to the second argument of `reduce`. Can be combined with boolean-returning functions like `is`, `isnt`, `propertyIs` or `propertyIsOneOf`.
```ts
["a", "a", "b"].reduce(countBy(el => el === "a"), 0); // Returns 2
["a", "a", "b"].reduce(countBy(is("a")), 0); // Returns 2
```
 */
export const countBy = <T>(func: (el: T) => boolean) => (acc: number, el: T) =>
  acc + (func(el) ? 1 : 0);
