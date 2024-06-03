import { module, test } from "qunit";
import { randomizeEmojiGender } from "../../discourse/lib/emoji-diversity";

const originalMathRandom = Math.random;

module("Unformatted Code Detector | randomize emoji gender", function (hooks) {
  hooks.afterEach(function () {
    // override in tests to make deterministic
    Math.random = originalMathRandom;
  });

  test("man technologist", function (assert) {
    Math.random = () => 0.4999;

    assert.strictEqual(randomizeEmojiGender("👩‍💻"), "👨‍💻");
  });

  test("woman technologist", function (assert) {
    Math.random = () => 0.5;

    assert.strictEqual(randomizeEmojiGender("👨‍💻"), "👩‍💻");
  });

  test("family: woman, woman, boy, boy", function (assert) {
    let i = 0;
    Math.random = () => [0.9, 0.9, 0, 0][i++];

    assert.strictEqual(randomizeEmojiGender("👨‍👩‍👧‍👦"), "👩‍👩‍👦‍👦");
  });

  test("family: man, man, girl, girl", function (assert) {
    let i = 0;
    Math.random = () => [0, 0, 0.9, 0.9][i++];

    assert.strictEqual(randomizeEmojiGender("👨‍👩‍👧‍👦"), "👨‍👨‍👧‍👧");
  });
});
