import { module, test } from "qunit";
import { stripIgnoredContent } from "../../discourse/core/strip-ignored-content";

module("Unformatted Code Detector | strip ignored content", function () {
  test("Unformatted Code Detector | BBCode tags", function (assert) {
    assert.strictEqual(
      stripIgnoredContent('[quote="a, post:8, topic:1120"]\nquoted\n[/quote]'),
      "",
      "tag with attributes"
    );

    assert.strictEqual(
      stripIgnoredContent("[QUOTE]upper[/quote]"),
      "",
      "opening and closing tag case do not have to agree"
    );

    assert.strictEqual(
      stripIgnoredContent('[quote="a] b"]quoted[/quote]'),
      "",
      "attributes containing a closing bracket"
    );

    assert.strictEqual(
      stripIgnoredContent("before [quote]quoted[/quote] after"),
      "before  after",
      "surrounding text is kept"
    );

    assert.strictEqual(
      stripIgnoredContent("unclosed [quote]forever"),
      "unclosed [quote]forever",
      "an unclosed tag is not a BBCode tag"
    );
  });

  test("Unformatted Code Detector | many unclosed BBCode tags", function (assert) {
    const content = "[quote]".repeat(3000);

    const start = performance.now();
    stripIgnoredContent(content);
    const elapsed = performance.now() - start;

    assert.true(
      elapsed < 1000,
      `stripping ${content.length} characters of unclosed tags took ${Math.round(elapsed)}ms, which must stay well under the 1000ms budget`
    );
  });
});
