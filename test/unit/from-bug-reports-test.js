import { module } from "qunit";
import { detectUnformattedCode } from "../../discourse/core/detect-code";
import { falseNegatives, falsePositives } from "../fixtures/bug-reports";
import { expectAll } from "../helpers/utils";

module("Unformatted Code Detector | bug reports", function () {
  expectAll(detectUnformattedCode, falseNegatives, true);
  expectAll(detectUnformattedCode, falsePositives, false);
});
