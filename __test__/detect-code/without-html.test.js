import { expectAll, defaultSettings } from "../utils";
import { withBareHTML } from "../fixtures/basic";

describe("Without HTML", () => {
  jest.resetModules();

  global.settings = {
    ...defaultSettings,
    include_html: false,
    sensitivity: 1,
    min_post_length_to_check: 0,
  };

  const {
    detectUnformattedCode,
  } = require("../../javascripts/unformatted_code_detector/lib/detect-code.js.es6");

  expectAll(detectUnformattedCode, withBareHTML, false);
});
