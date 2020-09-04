/** Use with: `filter`
 * 
 * Removes elements that are `undefined`
```ts
[1, undefined, 2].filter(isDefined); // Returns [1, 2]
```
 */
export const isDefined = <T>(x: T | undefined): x is T =>
  typeof x !== "undefined";

const findIndex = <T>(list: T[], pred: (a: T) => boolean) => {
  for (let i = 0; i < list.length; i++) {
    if (pred(list[i])) return i;
  }
  return -1;
};

const numberOfOccurencesBy = <T, U>(list: T[], el: T, map: (a: T) => U) => {
  let n = 0;
  for (let i = 0; i < list.length; i++) {
    if (map(list[i]) === map(el)) n++;
  }
  return n;
};

/** Use with: `filter`
 * 
 * Returns all duplicates (compared by the provided function)
```ts
[{ a: 1 }, { a : 1 }, { a: 2 }].filter(duplicatesBy(el => el.a)); // Returns [{ a: 1 }, { a: 1 }]
```
 */
export const duplicatesBy = <T>(func: (el: T) => unknown) => (
  el: T,
  _: number,
  list: T[]
) => numberOfOccurencesBy(list, el, func) > 1;

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
 * Returns duplicates by comparing the `key` property of the elements
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
 * Removes duplicates by comparing elements according to the provided function
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
 * Removes duplicates by comparing the `key` property of the elements
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
 * Returns a list of elements that are present in both lists compared by running `func` on each element
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
 * Removes the provided elements from the list compared by running `func` on each element
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

/**Use with: `sort`
 * 
 * Sort the elements by the return values of the provided function. Supports sorting by boolean values (elements that are `true` first).
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
 * Sort the elements by the property value at the provided key (can also be an array index). Supports sorting by boolean values (elements that are `true` first).
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
 * Returns the value at `key` (can also be an array index). Supports up to three keys of depth.
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
 * Sums the values returned from the provided function. If the list elements aren't numbers, a number must be passed as the second argument to `reduce`.
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
// export const sumBy = <T>(func: (el: T) => number) => (acc: T | number, el: T) =>
//   (typeof acc === "number" ? acc : func(acc)) + func(el);

/** Use with: `reduce`
 *
 * Sums the values at `key` for all elements. A number must be passed to the second argument of `reduce`.
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
 * Returns the element that returned the largest value from `func`
```ts
[{ a: 1 }, { a: 2 }, { a: 3 }].reduce(maxBy(el => el.a)); // Returns { a: 3 }
```
*/
export const maxBy = <T>(func: (el: T) => number) => (acc: T, el: T) =>
  func(el) > func(acc) ? el : acc;

/** Use with: `reduce`
 * 
 * Returns the element that has the largest value at `key`
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
 * Returns the element that returned the smallest value from `func`
```ts
[{ a: 1 }, { a: 2 }, { a: 3 }].reduce(minBy(el => el.a)); // Returns { a: 1 }
```
*/
export const minBy = <T>(func: (el: T) => number) => (acc: T, el: T) =>
  func(el) < func(acc) ? el : acc;

/** Use with: `reduce`
 * 
 * Returns the element that has the smallest value at `key`
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
 * Given a key-returning function, returns an object of lists of elements. A second argument must be passed to `reduce`. For javascript an empty object is enough. For typescript an object with properties or a type cast is required.
```ts
[{ age: 10 }, { age: 80 }].reduce(
  groupBy(el => (el.age > 30 ? "old" : "young")),
  { old: [], young: [] }
); // Returns { old: [{ age: 80 }], young: [{ age: 10 }]}
```
 */
export const groupBy = <K extends string, V>(func: (el: V) => K) => (
  acc: Record<K, V[]>,
  el: V
): Record<K, V[]> => {
  const groupName = func(el),
    group: V[] = acc[groupName] || [];
  return Object.assign({}, acc, { [groupName]: group.concat(el) });
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
  return func(el) ? [a0.concat(el), a1] : [a0, a1.concat(el)];
};

/** Use with: `reduce`
 *
 * Counts the number of times `func` returned `true` for the list elements. A number must be passed to the second argument of `reduce`.
```ts
["a", "a", "b"].reduce(countBy(el => el === "a"), 0); // Returns 2
```
 */
export const countBy = <T>(func: (el: T) => boolean) => (acc: number, el: T) =>
  acc + (func(el) ? 1 : 0);
