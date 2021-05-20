import { expectAll, defaultSettings } from "./utils";
import { falseNegatives, falsePositives } from "./fixtures/bug-reports";

describe("bug reports", () => {
  jest.resetModules();

  global.settings = defaultSettings;

  const {
    detectUnformattedCode,
  } = require("../javascripts/unformatted_code_detector/lib/detect-code.js.es6");

  expectAll(detectUnformattedCode, falseNegatives, true);
  expectAll(detectUnformattedCode, falsePositives, false);
});
