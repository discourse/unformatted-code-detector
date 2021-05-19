import { expectAll } from "./utils";
import { withUnformattedCode } from "./fixtures/fixtures";

describe("ignore if too short", () => {
  jest.resetModules();

  global.settings = {
    include_html: false,
    sensitivity: 1,
    min_post_length_to_check: 10_000,
    max_post_length_to_check: -1,
  };

  const {
    detectUnformattedCode,
  } = require("../javascripts/unformatted_code_detector/lib/detect-code.js.es6");

  expectAll(detectUnformattedCode, withUnformattedCode, false);
});

describe("ignore if too long", () => {
  jest.resetModules();

  global.settings = {
    include_html: false,
    sensitivity: 1,
    min_post_length_to_check: 0,
    max_post_length_to_check: 1,
  };

  const {
    detectUnformattedCode,
  } = require("../javascripts/unformatted_code_detector/lib/detect-code.js.es6");

  expectAll(
    detectUnformattedCode,
    withUnformattedCode.filter((str) => str.length > 1),
    false
  );
});
