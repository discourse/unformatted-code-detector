import { module, test } from "qunit";
import {
  CodeEnergyLevels,
  codeEnergyValues,
} from "../../discourse/core/code-energy";
import {
  getCodeEnergy,
  numSequentialLinesWithThresholdCodeEnergy,
} from "../../discourse/core/detect-code";

module("sequential lines", function (hooks) {
  hooks.beforeEach(function () {
    settings.min_sequential_lines_to_match = 3;
    settings.min_post_length_to_check = 0;
  });

  test("no empty lines", function (assert) {
    const str =
      "a != b\nsome prose\n!=\nmore prose\n/* multi\nline != !=\ncomment */\na\na != 5\na != 7\n";
    const { lines } = getCodeEnergy(str);

    const sequentialLines = numSequentialLinesWithThresholdCodeEnergy(
      codeEnergyValues[CodeEnergyLevels.Complex]
    )(lines);

    assert.strictEqual(sequentialLines, 3);
  });

  test("with empty lines", function (assert) {
    const str =
      "a != b\nsome prose\n\n!=\nmore prose\n/* multi\nline != !=\ncomment */\na\n\na != 5\na != 7\n";
    const { lines } = getCodeEnergy(str);

    const sequentialLines = numSequentialLinesWithThresholdCodeEnergy(
      codeEnergyValues[CodeEnergyLevels.Complex]
    )(lines);

    assert.strictEqual(sequentialLines, 3);
  });
});
