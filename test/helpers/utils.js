import { test } from "qunit";

export const wrap = (str) => {
  return str.split("\n").length > 1 ? "```\n" + str + "\n```" : "`" + str + "`";
};

const truncate = (len) => (str) =>
  str.slice(0, len) + (str.length > len ? "..." : "");
const toSingleLine = (str) => truncate(35)(str).replaceAll("\n", "\\n");

export const expectAll = (fn, tests, expected) => {
  tests.forEach((t) => {
    test(toSingleLine(t.toString()), function (assert) {
      assert.strictEqual(fn(t), expected);
    });
  });
};
