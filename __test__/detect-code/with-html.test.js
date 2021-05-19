import { expectAll } from "../utils";
import {
  noCode,
  withUnformattedCode,
  withFormattedCode,
  withBareHTML,
  withFormattedHTML,
} from "../fixtures/fixtures";

describe("With HTML", () => {
  jest.resetModules();

  global.settings = {
    include_html: true,
    sensitivity: 1,
    min_post_length_to_check: 0,
    max_post_length_to_check: -1,
  };

  const {
    detectUnformattedCode,
  } = require("../../javascripts/unformatted_code_detector/lib/detect-code.js.es6");

  expectAll(detectUnformattedCode, noCode, false);
  expectAll(detectUnformattedCode, withUnformattedCode, true);
  expectAll(detectUnformattedCode, withFormattedCode, false);
  expectAll(detectUnformattedCode, withBareHTML, true);
  expectAll(detectUnformattedCode, withFormattedHTML, false);
});
