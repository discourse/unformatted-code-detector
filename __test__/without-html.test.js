import { expectAll } from "./utils";
import { withBareHTML } from "./fixtures";

describe("Without HTML", () => {
  jest.resetModules();
  global.settings = { include_html: false, matches_to_ignore: 0 };
  const {
    detectUnformattedCode,
  } = require("../javascripts/unformatted_code_detector/lib/detectCode.js.es6");

  expectAll(detectUnformattedCode, withBareHTML, false);
});
