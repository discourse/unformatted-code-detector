import { module } from "qunit";
import { detectUnformattedCode } from "../../discourse/core/detect-code";
import { withUnformattedCode } from "../fixtures/basic";
import { expectAll } from "../helpers/utils";

module("ignore if too short", function (hooks) {
  hooks.beforeEach(function () {
    settings.sensitivity = 1;
    settings.min_post_length_to_check = 10_000;
  });

  expectAll(detectUnformattedCode, withUnformattedCode, false);
});

module("ignore if too long", function (hooks) {
  hooks.beforeEach(function () {
    settings.sensitivity = 1;
    settings.max_post_length_to_check = 1;
  });

  expectAll(
    detectUnformattedCode,
    withUnformattedCode.filter((str) => str.length > 1),
    false
  );
});
