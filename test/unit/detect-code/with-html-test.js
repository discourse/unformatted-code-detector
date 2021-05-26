import { module } from "qunit";
import { expectAll } from "../../helpers/utils";
import {
  noCode,
  withUnformattedCode,
  withFormattedCode,
  withBareHTML,
  withFormattedHTML,
} from "../../fixtures/basic";
import { detectUnformattedCode } from "../../../unformatted-code-detector/core/detect-code";

module("With HTML", ({ beforeEach }) => {
  beforeEach(() => {
    settings.sensitivity = 1;
    settings.min_post_length_to_check = 0;
  });

  expectAll(detectUnformattedCode, noCode, false);
  expectAll(detectUnformattedCode, withUnformattedCode, true);
  expectAll(detectUnformattedCode, withFormattedCode, false);
  expectAll(detectUnformattedCode, withBareHTML, true);
  expectAll(detectUnformattedCode, withFormattedHTML, false);
});
