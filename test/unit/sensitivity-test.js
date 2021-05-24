import { module, test } from "qunit";
import { applySensitivity } from "../unformatted-code-detector/core/sensitivity";

module("apply sensitivity", () => {
  test("lowest sensitivity", (assert) => {
    assert.strictEqual(applySensitivity(0)(1, 10), 1);
  });

  test("highest sensitivity", (assert) => {
    assert.strictEqual(applySensitivity(1)(1, 10), 10);
  });

  test("lowest sensitivity (higher = less sensitive)", (assert) => {
    assert.strictEqual(applySensitivity(0)(10, 1), 10);
  });

  test("highest sensitivity (higher = less sensitive)", (assert) => {
    assert.strictEqual(applySensitivity(1)(10, 1), 1);
  });

  test("middle sensitivity", (assert) => {
    assert.strictEqual(applySensitivity(0.5)(1, 9), 5);
  });

  test("middle sensitivity (higher = less sensitive)", (assert) => {
    assert.strictEqual(applySensitivity(0.5)(9, 1), 5);
  });

  test("mid-high sensitivity", (assert) => {
    assert.strictEqual(applySensitivity(0.75)(0, 4), 3);
  });

  test("mid-high sensitivity (higher = less sensitive)", (assert) => {
    assert.strictEqual(applySensitivity(0.75)(4, 0), 1);
  });

  test("mid-low sensitivity", (assert) => {
    assert.strictEqual(applySensitivity(0.25)(0, 4), 1);
  });

  test("mid-low sensitivity (higher = less sensitive)", (assert) => {
    assert.strictEqual(applySensitivity(0.25)(4, 0), 3);
  });
});
