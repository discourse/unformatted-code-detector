import { expectAll } from "../utils";
import { withBareHTML } from "../fixtures/fixtures";

describe("Without HTML", () => {
  jest.resetModules();

  global.settings = {
    include_html: false,
    sensitivity: 1,
    min_post_length_to_check: 0,
    max_post_length_to_check: -1,
  };

  const {
    detectUnformattedCode,
  } = require("../../javascripts/unformatted_code_detector/lib/detect-code.js.es6");

  expectAll(detectUnformattedCode, withBareHTML, false);
});
