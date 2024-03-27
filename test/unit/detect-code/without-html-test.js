import { module } from "qunit";
import { detectUnformattedCode } from "../../../discourse/core/detect-code";
import { withBareHTML } from "../../fixtures/basic";
import { expectAll } from "../../helpers/utils";

module("Without HTML", function (hooks) {
  hooks.beforeEach(function () {
    settings.sensitivity = 1;
    settings.min_post_length_to_check = 0;
    settings.include_html = false;
  });

  expectAll(detectUnformattedCode, withBareHTML, false);
});
