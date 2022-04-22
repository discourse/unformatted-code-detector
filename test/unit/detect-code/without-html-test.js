import { module } from "qunit";
import { expectAll } from "../../helpers/utils";
import { withBareHTML } from "../../fixtures/basic";
import { detectUnformattedCode } from "../../../unformatted-code-detector/core/detect-code";

module("Without HTML", function (hooks) {
  hooks.beforeEach(function () {
    settings.sensitivity = 1;
    settings.min_post_length_to_check = 0;
    settings.include_html = false;
  });

  expectAll(detectUnformattedCode, withBareHTML, false);
});
