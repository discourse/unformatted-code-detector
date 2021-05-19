describe("sequential lines", () => {
  jest.resetModules();

  global.settings = {
    include_html: true,
    matches_to_ignore: 0,
    min_sequential_lines_to_match: 3,
    min_post_length_to_check: 0,
  };

  const {
    getCodeEnergy,
    numSequentialLinesWithThresholdCodeEnergy,
  } = require("../javascripts/unformatted_code_detector/lib/detect-code.js.es6");

  const {
    codeEnergyValues,
    CodeEnergyLevels,
  } = require("../javascripts/unformatted_code_detector/lib/code-energy.js.es6");

  test("no empty lines", () => {
    const str =
      "a != b\nsome prose\n!=\nmore prose\n/* multi\nline != !=\ncomment */\na\na != 5\na != 7\n";
    const { lines } = getCodeEnergy(str);

    const sequentialLines = numSequentialLinesWithThresholdCodeEnergy(
      codeEnergyValues[CodeEnergyLevels.Complex]
    )(lines);
    expect(sequentialLines).toEqual(3);
  });

  test("with empty lines", () => {
    const str =
      "a != b\nsome prose\n\n!=\nmore prose\n/* multi\nline != !=\ncomment */\na\n\na != 5\na != 7\n";
    const { lines } = getCodeEnergy(str);

    const sequentialLines = numSequentialLinesWithThresholdCodeEnergy(
      codeEnergyValues[CodeEnergyLevels.Complex]
    )(lines);
    expect(sequentialLines).toEqual(3);
  });
});
