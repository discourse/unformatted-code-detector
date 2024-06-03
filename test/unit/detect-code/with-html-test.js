import { module } from "qunit";
import { detectUnformattedCode } from "../../../discourse/core/detect-code";
import {
  noCode,
  withBareHTML,
  withFormattedCode,
  withFormattedHTML,
  withUnformattedCode,
} from "../../fixtures/basic";
import { expectAll } from "../../helpers/utils";

module("Unformatted Code Detector | with HTML", function (hooks) {
  hooks.beforeEach(function () {
    settings.sensitivity = 1;
    settings.min_post_length_to_check = 0;
  });

  expectAll(detectUnformattedCode, noCode, false);
  expectAll(detectUnformattedCode, withUnformattedCode, true);
  expectAll(detectUnformattedCode, withFormattedCode, false);
  expectAll(detectUnformattedCode, withBareHTML, true);
  expectAll(detectUnformattedCode, withFormattedHTML, false);
});
