import { module } from "qunit";
import { expectAll } from "../helpers/utils";
import { falseNegatives, falsePositives } from "../fixtures/bug-reports";
import { detectUnformattedCode } from "../../unformatted-code-detector/core/detect-code";

module("bug reports", function () {
  expectAll(detectUnformattedCode, falseNegatives, true);
  expectAll(detectUnformattedCode, falsePositives, false);
});
