import { expectAll } from "./utils";
import {
  noCode,
  withUnformattedCode,
  withFormattedCode,
  withBareHTML,
  withFormattedHTML,
} from "./fixtures";

describe("With HTML", () => {
  jest.resetModules();
  global.settings = { include_html: true, matches_to_ignore: 0 };
  const {
    detectUnformattedCode,
  } = require("../javascripts/unformatted_code_detector/lib/detectCode.js.es6");

  expectAll(detectUnformattedCode, noCode, false);
  expectAll(detectUnformattedCode, withUnformattedCode, true);
  expectAll(detectUnformattedCode, withFormattedCode, false);
  expectAll(detectUnformattedCode, withBareHTML, true);
  expectAll(detectUnformattedCode, withFormattedHTML, false);
});
