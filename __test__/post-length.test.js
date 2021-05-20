import { expectAll, defaultSettings } from "./utils";
import { withUnformattedCode } from "./fixtures/basic";

describe("ignore if too short", () => {
  jest.resetModules();

  global.settings = {
    ...defaultSettings,
    sensitivity: 1,
    min_post_length_to_check: 10_000,
  };

  const {
    detectUnformattedCode,
  } = require("../javascripts/unformatted_code_detector/lib/detect-code.js.es6");

  expectAll(detectUnformattedCode, withUnformattedCode, false);
});

describe("ignore if too long", () => {
  jest.resetModules();

  global.settings = {
    ...defaultSettings,
    sensitivity: 1,
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
