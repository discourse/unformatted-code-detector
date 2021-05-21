import { module } from "qunit";
import { expectAll } from "../helpers/utils";
import { falseNegatives, falsePositives } from "../fixtures/bug-reports";
import { detectUnformattedCode } from "../unformatted_code_detector/lib/detect-code";

module("bug reports", () => {
  expectAll(detectUnformattedCode, falseNegatives, true);
  expectAll(detectUnformattedCode, falsePositives, false);
});
