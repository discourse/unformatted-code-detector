import { getLineBoundaries, isBetween } from "./helpers";
import { stripIgnoredContent } from "./strip-ignored-content";
import {
  getCodeEnergyIndicators,
  CodeEnergyLevels,
  codeEnergyValues,
} from "./code-energy";
import { sensitivityConfig } from "./sensitivity";

export const getCodeEnergy = (content) => {
  let totalCodeEnergy = 0;
  let totalComplexMatches = 0;

  const lines = getLineBoundaries(content);

  lines.forEach((x) => (x.matches = 0));

  for (const { matcher, value } of getCodeEnergyIndicators()) {
    const matches = [...content.matchAll(matcher)];

    totalCodeEnergy += matches.length * value;

    if (value === codeEnergyValues[CodeEnergyLevels.Complex]) {
      totalComplexMatches += matches.length;
    }

    for (const match of matches) {
      const startIndex = match.index;
      const endIndex = startIndex + match[0].length;

      for (const line of lines) {
        const isThisLine = isBetween(line.start, line.end);

        if (
          isThisLine(startIndex) ||
          isThisLine(endIndex) ||
          (line.start >= startIndex && line.end <= endIndex)
        ) {
          ++line.matches;
        }
      }
    }
  }

  return { totalCodeEnergy, totalComplexMatches, lines };
};

export const numSequentialLinesWithThresholdCodeEnergy = (threshold) => (
  lines
) => {
  let maxContiguous = 0;
  let curContiguous = 0;

  for (const line of lines) {
    // empty/whitespace-only lines don't affect contiguity
    if (!line.content.trim().length) continue;

    if (line.matches >= threshold) {
      ++curContiguous;
    } else {
      maxContiguous = Math.max(maxContiguous, curContiguous);
      curContiguous = 0;
    }
  }

  return Math.max(maxContiguous, curContiguous);
};

const detectCode = (content) => {
  const {
    complexMatchesToIgnore,
    minSequentialLinesToMatch,
    minTotalCodeEnergy,
  } = sensitivityConfig;

  const { totalCodeEnergy, totalComplexMatches, lines } = getCodeEnergy(
    content
  );

  if (totalComplexMatches <= complexMatchesToIgnore) return false;

  if (totalCodeEnergy < minTotalCodeEnergy) return false;

  if (
    numSequentialLinesWithThresholdCodeEnergy(
      codeEnergyValues[CodeEnergyLevels.Complex]
    )(lines) < minSequentialLinesToMatch
  ) {
    return false;
  }

  return true;
};

export const detectUnformattedCode = (content) => {
  const strippedContent = stripIgnoredContent(content);

  return isBetween(
    settings.min_post_length_to_check,
    settings.max_post_length_to_check === -1
      ? Infinity
      : settings.max_post_length_to_check
  )(content.length)
    ? detectCode(strippedContent)
    : false;
};
