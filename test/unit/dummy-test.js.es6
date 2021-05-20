import { module, test } from "qunit";
import { detectUnformattedCode } from "../unformatted_code_detector/lib/detect-code";
module("dummy", () => {
  test("success", (assert) => {
    assert.strictEqual(true, true);
    console.log(settings.disable_at_trust_level);
    assert.equal(settings.disable_at_trust_level, 3);
    settings.disable_at_trust_level = -1;
    assert.equal(settings.disable_at_trust_level, -1);
  });
});
