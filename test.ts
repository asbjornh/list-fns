import test from "ava";

import {
  isDefined,
  uniqueBy,
  unique,
  uniqueByProperty,
  intersection,
  intersectionBy,
  intersectionByProperty,
  exclude,
  excludeBy,
  excludeByProperty,
  by,
  byProperty,
  get,
  sum,
  sumBy,
  sumByProperty,
  max,
  maxBy,
  maxByProperty,
  min,
  minBy,
  minByProperty,
  groupBy,
  partition,
} from "./index";

test("isDefined", t => {
  t.deepEqual([1, 2].filter(isDefined), [1, 2]);
  t.deepEqual([1, 2, undefined, 3].filter(isDefined), [1, 2, 3]);
});

test("unique", t => {
  t.deepEqual([1, 2], [1, 1, 2].filter(unique));
  t.deepEqual(["a", "b"], ["a", "a", "b"].filter(unique));
});

test("uniqueBy", t => {
  t.deepEqual([{ a: 1 }], [{ a: 1 }, { a: 1 }].filter(uniqueBy(el => el.a)));
  t.deepEqual([1], [1, 1.5].filter(uniqueBy(Math.floor)));
});

test("uniqueByProperty", t => {
  t.deepEqual([{ a: 1 }], [{ a: 1 }, { a: 1 }].filter(uniqueByProperty("a")));
});

test("intersection", t => {
  t.deepEqual([], [1, 2, 3].filter(intersection([])));
  t.deepEqual([2, 3], [1, 2, 3].filter(intersection([2, 3, 4])));
});

test("intersectionBy", t => {
  t.deepEqual(
    [],
    [{ a: 1 }, { a: 2 }, { a: 3 }].filter(
      intersectionBy(el => el.a, [] as { a: number }[])
    )
  );
  t.deepEqual(
    [{ a: 2 }, { a: 3 }],
    [{ a: 1 }, { a: 2 }, { a: 3 }].filter(
      intersectionBy(el => el.a, [{ a: 2 }, { a: 3 }, { a: 4 }])
    )
  );
});

test("intersectionByProperty", t => {
  t.deepEqual(
    [],
    [{ a: 1 }, { a: 2 }, { a: 3 }].filter(
      intersectionByProperty("a", [] as { a: number }[])
    )
  );
  t.deepEqual(
    [{ a: 2 }, { a: 3 }],
    [{ a: 1 }, { a: 2 }, { a: 3 }].filter(
      intersectionByProperty("a", [{ a: 2 }, { a: 3 }, { a: 4 }])
    )
  );
});

test("exclude", t => {
  t.deepEqual([1, 2], [1, 2].filter(exclude([])));
  t.deepEqual([2], [1, 2, 1, 1].filter(exclude([1])));
});

test("excludeBy", t => {
  t.deepEqual([2], [1, 1.5, 2].filter(excludeBy(Math.floor, [1])));
  t.deepEqual(
    [{ a: 1 }, { a: 2 }],
    [{ a: 1 }, { a: 2 }].filter(excludeBy(el => el.a, [] as { a: number }[]))
  );
  t.deepEqual(
    [{ a: 3 }, { a: 4 }],
    [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }].filter(
      excludeBy(el => el.a, [{ a: 1 }, { a: 2 }])
    )
  );
});

test("excludeByProperty", t => {
  t.deepEqual(
    [{ a: 1 }, { a: 2 }],
    [{ a: 1 }, { a: 2 }].filter(excludeByProperty("a", [] as { a: number }[]))
  );
  t.deepEqual(
    [{ a: 3 }, { a: 4 }],
    [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }].filter(
      excludeByProperty("a", [{ a: 1 }, { a: 2 }])
    )
  );
});

test("by", t => {
  // TODO: Expected first
  t.deepEqual([1.5, 1, 2.5, 2], [2.5, 2, 1.5, 1].sort(by(Math.floor)));
  t.deepEqual([{ a: 1 }, { a: 2 }], [{ a: 2 }, { a: 1 }].sort(by(el => el.a)));
  t.deepEqual(
    [{ a: { b: 1 } }, { a: { b: 2 } }],
    [{ a: { b: 2 } }, { a: { b: 1 } }].sort(by(get("a", "b")))
  );
});

test("by boolean", t => {
  const expected = [
    { a: 3, b: true },
    { a: 2, b: true },
    { a: 1, b: false },
  ];
  const input = [
    { a: 1, b: false },
    { a: 3, b: true },
    { a: 2, b: true },
  ];
  t.deepEqual(input.sort(by(el => el.b)), expected);
});

test("byProperty", t => {
  t.deepEqual([{ a: 1 }, { a: 2 }], [{ a: 2 }, { a: 1 }].sort(byProperty("a")));
  t.deepEqual(
    [
      ["a", 1],
      ["a", 2],
    ],
    [
      ["a", 2],
      ["a", 1],
    ].sort(byProperty(1))
  );
});

test("byProperty boolean", t => {
  const expected = [
    { a: 3, b: true },
    { a: 2, b: true },
    { a: 1, b: false },
  ];
  const input = [
    { a: 1, b: false },
    { a: 3, b: true },
    { a: 2, b: true },
  ];
  t.deepEqual(input.sort(byProperty("b")), expected);
});

test("get", t => {
  t.deepEqual([1, 2], [{ a: 1 }, { a: 2 }].map(get("a")));
  t.deepEqual(
    [1, 2],
    [
      ["a", 1],
      ["a", 2],
    ].map(get(1))
  );
});

test("get 2", t => {
  t.deepEqual([1, 2], [{ a: { b: 1 } }, { a: { b: 2 } }].map(get("a", "b")));
});

test("get 3", t => {
  t.deepEqual(
    [2, 4],
    [{ a: { b: [1, 2] } }, { a: { b: [3, 4] } }].map(get("a", "b", 1))
  );
});

test("sum", t => {
  t.is(6, [1, 2, 3].reduce(sum));
  t.is(2, [2].reduce(sum));
  t.is(4, [2].reduce(sum, 2));
});

test("sumBy", t => {
  t.is(6, [1.9, 2.9, 3.9].reduce(sumBy(Math.floor)));
  t.is(
    3,
    [{ a: 1 }, { a: 2 }].reduce(
      sumBy(el => el.a),
      0
    )
  );
});

test("sumByProperty", t => {
  t.is(3, [{ a: 1 }, { a: 2 }].reduce(sumByProperty("a"), 0));
});

test("max", t => {
  t.is(4, [1, 2, 3, 4].reduce(max));
});

test("maxBy", t => {
  t.is(3.1, [3.1, 3.5].reduce(maxBy(Math.floor)));
  t.deepEqual(
    { a: 3 },
    [{ a: 1 }, { a: 2 }, { a: 3 }].reduce(maxBy(el => el.a))
  );
});

test("maxByProperty", t => {
  t.deepEqual(
    { a: 3 },
    [{ a: 1 }, { a: 2 }, { a: 3 }].reduce(maxByProperty("a"))
  );
});

test("min", t => {
  t.is(1, [1, 2, 3, 4].reduce(min));
});

test("minBy", t => {
  t.is(1.5, [1.5, 1].reduce(minBy(Math.floor)));
  t.deepEqual(
    { a: 1 },
    [{ a: 1 }, { a: 2 }, { a: 3 }].reduce(minBy(el => el.a))
  );
});

test("minByProperty", t => {
  t.deepEqual(
    { a: 1 },
    [{ a: 1 }, { a: 2 }, { a: 3 }].reduce(minByProperty("a"))
  );
});

test("groupBy", t => {
  const { old, young } = [{ age: 10 }, { age: 80 }].reduce(
    groupBy(el => (el.age > 30 ? "old" : "young")),
    { old: [], young: [] }
  );
  t.deepEqual(old, [{ age: 80 }]);
  t.deepEqual(young, [{ age: 10 }]);

  const obj = [{ age: 10 }, { age: 80 }].reduce(
    groupBy(el => (el.age > 30 ? "old" : "young")),
    {} as Record<"old" | "young", { age: number }[]>
  );
  t.deepEqual(obj, { old: [{ age: 80 }], young: [{ age: 10 }] });
});

test("partition", t => {
  const [old, young] = [{ age: 10 }, { age: 80 }].reduce(
    partition(el => el.age > 30),
    []
  );
  t.deepEqual(old, [{ age: 80 }]);
  t.deepEqual(young, [{ age: 10 }]);
});

test("partition mapping", t => {
  const [old, young] = [{ age: 10 }, { age: 80 }]
    .reduce(
      partition(el => el.age > 30),
      []
    )
    .map(els => els.map(el => el.age));
  t.deepEqual(old, [80]);
  t.deepEqual(young, [10]);
});
