import test from "ava";

import {
  isDefined,
  or,
  uniqueBy,
  unique,
  uniqueByProperty,
  is,
  isBy,
  propertyIs,
  isnt,
  isntBy,
  propertyIsnt,
  intersection,
  intersectionBy,
  intersectionByProperty,
  exclude,
  excludeBy,
  excludeByProperty,
  by,
  byProperty,
  byValue,
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
  countBy,
  duplicates,
  duplicatesBy,
  duplicatesByProperty,
  isOneOf,
  isOneOfBy,
  propertyIsOneOf,
  isntOneOf,
  isntOneOfBy,
  propertyIsntOneOf,
} from "./index";

test("isDefined", t => {
  t.deepEqual([1, 2].filter(isDefined), [1, 2]);
  t.deepEqual([1, 2, undefined, 3].filter(isDefined), [1, 2, 3]);
});

test("or", t => {
  t.deepEqual([1, 2].map(or(0)), [1, 2]);
  t.deepEqual([1, 2, undefined, 3].map(or(0)), [1, 2, 0, 3]);
});

test("duplicates", t => {
  t.deepEqual([1, 1, 2, 1, 2, 3].filter(duplicates), [1, 1, 2, 1, 2]);
  t.deepEqual(["a", "a", "b"].filter(duplicates), ["a", "a"]);
});

test("duplicatesBy", t => {
  t.deepEqual([{ a: 1 }, { a: 1 }, { a: 2 }].filter(duplicatesBy(el => el.a)), [
    { a: 1 },
    { a: 1 },
  ]);
  t.deepEqual([1, 1.5, 2].filter(duplicatesBy(Math.floor)), [1, 1.5]);
});

test("duplicatesByProperty", t => {
  t.deepEqual(
    [{ a: 1 }, { a: 1 }, { a: 2 }].filter(duplicatesByProperty("a")),
    [{ a: 1 }, { a: 1 }]
  );
});

test("unique", t => {
  t.deepEqual([1, 1, 2].filter(unique), [1, 2]);
  t.deepEqual(["a", "a", "b"].filter(unique), ["a", "b"]);
});

test("uniqueBy", t => {
  t.deepEqual([{ a: 1 }, { a: 1 }].filter(uniqueBy(el => el.a)), [{ a: 1 }]);
  t.deepEqual([1, 1.5].filter(uniqueBy(Math.floor)), [1]);
});

test("uniqueByProperty", t => {
  t.deepEqual([{ a: 1 }, { a: 1 }].filter(uniqueByProperty("a")), [{ a: 1 }]);
});

test("is", t => {
  t.deepEqual([1, 2, 3].find(is(1)), 1);
  t.deepEqual([1, 2, 3].filter(is(1)), [1]);
});

test("isBy", t => {
  t.deepEqual([{ a: 1 }, { a: 2 }].find(isBy(el => el.a, 2)), { a: 2 });
  t.deepEqual([{ a: 1 }, { a: 2 }].filter(isBy(el => el.a, 2)), [{ a: 2 }]);

  t.deepEqual([1, 1.5, 2].filter(isBy(Math.floor, 1)), [1, 1.5]);
});

test("propertyIs", t => {
  t.deepEqual([{ a: 1 }, { a: 2 }].find(propertyIs("a", 2)), { a: 2 });
  t.deepEqual([{ a: 1 }, { a: 2 }].filter(propertyIs("a", 2)), [{ a: 2 }]);
});

test("isnt", t => {
  t.deepEqual([1, 2, 3].find(isnt(1)), 2);
  t.deepEqual([1, 2, 2].filter(isnt(1)), [2, 2]);
});

test("isntBy", t => {
  t.deepEqual([{ a: 1 }, { a: 2 }].find(isntBy(el => el.a, 2)), { a: 1 });
  t.deepEqual([{ a: 1 }, { a: 2 }].filter(isntBy(el => el.a, 2)), [{ a: 1 }]);

  t.deepEqual([1, 1.5, 2].filter(isntBy(Math.floor, 1)), [2]);
});

test("propertyIsnt", t => {
  t.deepEqual([{ a: 1 }, { a: 2 }].find(propertyIsnt("a", 2)), { a: 1 });
  t.deepEqual([{ a: 1 }, { a: 2 }].filter(propertyIsnt("a", 2)), [{ a: 1 }]);
});

test("intersection", t => {
  t.deepEqual([1, 2, 3].filter(intersection([])), []);
  t.deepEqual([1, 2, 3].filter(intersection([2, 3, 4])), [2, 3]);
});

test("intersectionBy", t => {
  t.deepEqual(
    [{ a: 1 }, { a: 2 }, { a: 3 }].filter(
      intersectionBy(el => el.a, [] as { a: number }[])
    ),
    []
  );
  t.deepEqual(
    [{ a: 1 }, { a: 2 }, { a: 3 }].filter(
      intersectionBy(el => el.a, [{ a: 2 }, { a: 3 }, { a: 4 }])
    ),
    [{ a: 2 }, { a: 3 }]
  );
});

test("intersectionByProperty", t => {
  t.deepEqual(
    [{ a: 1 }, { a: 2 }, { a: 3 }].filter(
      intersectionByProperty("a", [] as { a: number }[])
    ),
    []
  );
  t.deepEqual(
    [{ a: 1 }, { a: 2 }, { a: 3 }].filter(
      intersectionByProperty("a", [{ a: 2 }, { a: 3 }, { a: 4 }])
    ),
    [{ a: 2 }, { a: 3 }]
  );
});

test("exclude", t => {
  t.deepEqual([1, 2].filter(exclude([])), [1, 2]);
  t.deepEqual([1, 2, 1, 1].filter(exclude([1])), [2]);
});

test("excludeBy", t => {
  t.deepEqual([1, 1.5, 2].filter(excludeBy(Math.floor, [1])), [2]);
  t.deepEqual(
    [{ a: 1 }, { a: 2 }].filter(excludeBy(el => el.a, [] as { a: number }[])),
    [{ a: 1 }, { a: 2 }]
  );
  t.deepEqual(
    [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }].filter(
      excludeBy(el => el.a, [{ a: 1 }, { a: 2 }])
    ),
    [{ a: 3 }, { a: 4 }]
  );
});

test("excludeByProperty", t => {
  t.deepEqual(
    [{ a: 1 }, { a: 2 }].filter(excludeByProperty("a", [] as { a: number }[])),
    [{ a: 1 }, { a: 2 }]
  );
  t.deepEqual(
    [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }].filter(
      excludeByProperty("a", [{ a: 1 }, { a: 2 }])
    ),
    [{ a: 3 }, { a: 4 }]
  );
});

test("by", t => {
  t.deepEqual([2.5, 2, 1.5, 1].sort(by(Math.floor)), [1.5, 1, 2.5, 2]);
  t.deepEqual([{ a: 2 }, { a: 1 }].sort(by(el => el.a)), [{ a: 1 }, { a: 2 }]);
  t.deepEqual([{ a: { b: 2 } }, { a: { b: 1 } }].sort(by(get("a", "b"))), [
    { a: { b: 1 } },
    { a: { b: 2 } },
  ]);
});

test("byValue", t => {
  t.deepEqual([100, 25].sort(byValue), [25, 100]);
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
  t.deepEqual([{ a: 2 }, { a: 1 }].sort(byProperty("a")), [{ a: 1 }, { a: 2 }]);
  t.deepEqual(
    [
      ["a", 2],
      ["a", 1],
    ].sort(byProperty(1)),
    [
      ["a", 1],
      ["a", 2],
    ]
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
  t.deepEqual([{ a: 1 }, { a: 2 }].map(get("a")), [1, 2]);
  t.deepEqual(
    [
      ["a", 1],
      ["a", 2],
    ].map(get(1)),
    [1, 2]
  );
});

test("get 2", t => {
  t.deepEqual([{ a: { b: 1 } }, { a: { b: 2 } }].map(get("a", "b")), [1, 2]);
});

test("get 3", t => {
  t.deepEqual(
    [{ a: { b: [1, 2] } }, { a: { b: [3, 4] } }].map(get("a", "b", 1)),
    [2, 4]
  );
});

test("sum", t => {
  t.is([1, 2, 3].reduce(sum), 6);
  t.is([2].reduce(sum), 2);
  t.is([2].reduce(sum, 2), 4);
});

test("sumBy", t => {
  t.is([1.9, 2.9, 3.9].reduce(sumBy(Math.floor)), 6);
  t.is(
    [{ a: 1 }, { a: 2 }].reduce(
      sumBy(el => el.a),
      0
    ),
    3
  );
});

test("sumByProperty", t => {
  t.is([{ a: 1 }, { a: 2 }].reduce(sumByProperty("a"), 0), 3);
});

test("max", t => {
  t.is([1, 2, 3, 4].reduce(max), 4);
});

test("maxBy", t => {
  t.is([3.1, 3.5].reduce(maxBy(Math.floor)), 3.1);
  t.deepEqual([{ a: 1 }, { a: 2 }, { a: 3 }].reduce(maxBy(el => el.a)), {
    a: 3,
  });
});

test("maxByProperty", t => {
  t.deepEqual([{ a: 1 }, { a: 2 }, { a: 3 }].reduce(maxByProperty("a")), {
    a: 3,
  });
});

test("min", t => {
  t.is([1, 2, 3, 4].reduce(min), 1);
});

test("minBy", t => {
  t.is([1.5, 1].reduce(minBy(Math.floor)), 1.5);
  t.deepEqual([{ a: 1 }, { a: 2 }, { a: 3 }].reduce(minBy(el => el.a)), {
    a: 1,
  });
});

test("minByProperty", t => {
  t.deepEqual([{ a: 1 }, { a: 2 }, { a: 3 }].reduce(minByProperty("a")), {
    a: 1,
  });
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

  const dict = [{ name: "a" }, { name: "a" }, { name: "b" }, {}].reduce(
    groupBy(el => el.name),
    {}
  );
  t.deepEqual(dict, { a: [{ name: "a" }, { name: "a" }], b: [{ name: "b" }] });
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

test("countBy", t => {
  t.is(
    ["a", "a", "b"].reduce(
      countBy(el => el === "a"),
      0
    ),
    2
  );
  t.is(["a", "a", "b"].reduce(countBy(is("a")), 0), 2);
});

test("isOneOf", t => {
  t.deepEqual([1, 1, 2, 2, 3].filter(isOneOf([2, 3])), [2, 2, 3]);
});

test("isOneOfBy", t => {
  t.deepEqual(
    [{ a: 1 }, { a: 2 }, { a: 3 }].find(isOneOfBy(el => el.a, [2, 3])),
    { a: 2 }
  );
  t.deepEqual(
    [{ a: 1 }, { a: 2 }, { a: 3 }].filter(isOneOfBy(el => el.a, [2, 3])),
    [{ a: 2 }, { a: 3 }]
  );
  t.deepEqual([1, 1.5, 2, 3].filter(isOneOfBy(Math.floor, [1, 2])), [
    1,
    1.5,
    2,
  ]);
});

test("propertyIsOneOf", t => {
  t.deepEqual(
    [{ a: 1 }, { a: 2 }, { a: 3 }].find(propertyIsOneOf("a", [2, 3])),
    { a: 2 }
  );
  t.deepEqual(
    [{ a: 1 }, { a: 2 }, { a: 3 }].filter(propertyIsOneOf("a", [2, 3])),
    [{ a: 2 }, { a: 3 }]
  );
});

test("isntOneOf", t => {
  t.deepEqual([1, 1, 2, 2, 3].filter(isntOneOf([2, 3])), [1, 1]);
});

test("isntOneOfBy", t => {
  t.deepEqual(
    [{ a: 1 }, { a: 2 }, { a: 3 }].find(isntOneOfBy(el => el.a, [2, 3])),
    { a: 1 }
  );
  t.deepEqual(
    [{ a: 1 }, { a: 2 }, { a: 3 }].filter(isntOneOfBy(el => el.a, [2, 3])),
    [{ a: 1 }]
  );
});

test("propertyIsntOneOf", t => {
  t.deepEqual(
    [{ a: 1 }, { a: 2 }, { a: 3 }].find(propertyIsntOneOf("a", [2, 3])),
    { a: 1 }
  );
  t.deepEqual(
    [{ a: 1 }, { a: 2 }, { a: 3 }].filter(propertyIsntOneOf("a", [2, 3])),
    [{ a: 1 }]
  );
});
