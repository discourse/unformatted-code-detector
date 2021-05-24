import { module, test } from "qunit";
import { randomizeEmojiGender } from "../unformatted-code-detector/helpers/emoji-diversity";

const originalMathRandom = Math.random;

module("randomize emoji gender", ({ afterEach }) => {
  afterEach(() => {
    // override in tests to make deterministic
    Math.random = originalMathRandom;
  });

  test("man technologist", (assert) => {
    Math.random = () => 0.4999;

    assert.strictEqual(randomizeEmojiGender("👩‍💻"), "👨‍💻");
  });

  test("woman technologist", (assert) => {
    Math.random = () => 0.5;

    assert.strictEqual(randomizeEmojiGender("👨‍💻"), "👩‍💻");
  });

  test("family: woman, woman, boy, boy", (assert) => {
    let i = 0;
    Math.random = () => [0.9, 0.9, 0, 0][i++];

    assert.strictEqual(randomizeEmojiGender("👨‍👩‍👧‍👦"), "👩‍👩‍👦‍👦");
  });

  test("family: man, man, girl, girl", (assert) => {
    let i = 0;
    Math.random = () => [0, 0, 0.9, 0.9][i++];

    assert.strictEqual(randomizeEmojiGender("👨‍👩‍👧‍👦"), "👨‍👨‍👧‍👧");
  });
});
