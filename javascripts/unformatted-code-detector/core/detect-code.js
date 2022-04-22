import { getLineBoundaries, isBetween } from "../helpers/boundaries";
import { stripIgnoredContent } from "./strip-ignored-content";
import {
  CodeEnergyLevels,
  codeEnergyValues,
  getCodeEnergyIndicators,
} from "./code-energy";
import { sensitivityConfig } from "./sensitivity";

export const getCodeEnergy = (content) => {
  let totalCodeEnergy = 0;
  let totalComplexMatches = 0;

  const lines = getLineBoundaries(content);

  lines.forEach((x) => {
    x.matches = 0;
    x.matched_patterns = [];
  });

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
          line.matched_patterns.push({ matcher, value });
        }
      }
    }
  }

  return { totalCodeEnergy, totalComplexMatches, lines };
};

export const numSequentialLinesWithThresholdCodeEnergy =
  (threshold) => (lines) => {
    let maxContiguous = 0;
    let curContiguous = 0;

    for (const line of lines) {
      // empty/whitespace-only lines don't affect contiguity
      if (!line.content.trim().length) {
        continue;
      }

      if (line.matches >= threshold) {
        ++curContiguous;
      } else {
        maxContiguous = Math.max(maxContiguous, curContiguous);
        curContiguous = 0;
      }
    }

    return Math.max(maxContiguous, curContiguous);
  };

export const printDebugInfo = (content) => {
  content = stripIgnoredContent(content);

  const {
    complexMatchesToIgnore,
    minSequentialLinesToMatch,
    minTotalCodeEnergy,
  } = sensitivityConfig;

  const { totalCodeEnergy, totalComplexMatches, lines } =
    getCodeEnergy(content);

  const debugTable = [];

  let consecutive = 0;
  lines.forEach((l) => {
    if (!l.content.trim()) {
      return;
    }
    if (l.matches) {
      consecutive++;
    } else {
      consecutive = 0;
    }
    debugTable.push([
      l.matches ? String(l.matches) : "",
      consecutive ? String(consecutive) : "",
      l.matched_patterns.length
        ? `\`${l.matched_patterns.map((p) => p.matcher).join("`, `")}\``
        : "",
      l.content,
    ]);
  });

  const columns = ["matches", "cumulative", "matched patterns", "content"];
  const dividers = columns.map(() => "");

  columns.forEach((c, i) => {
    const longest = Math.max(
      c.length,
      ...debugTable.map((row) => row[i].length)
    );
    debugTable.forEach((row) => (row[i] = row[i].padEnd(longest)));
    columns[i] = c.padEnd(longest);
    dividers[i] = dividers[i].padEnd(longest, "-");
  });

  debugTable.unshift(columns, dividers);

  // eslint-disable-next-line no-console
  console.log(debugTable.map((l) => `| ${l.join(" | ")} |`).join("\n"));

  // eslint-disable-next-line no-console
  console.log("Result is ", { totalCodeEnergy, totalComplexMatches, lines });
  // eslint-disable-next-line no-console
  console.log("Sensitivity Config is ", {
    complexMatchesToIgnore,
    minSequentialLinesToMatch,
    minTotalCodeEnergy,
  });
};

const detectCode = (content) => {
  const {
    complexMatchesToIgnore,
    minSequentialLinesToMatch,
    minTotalCodeEnergy,
  } = sensitivityConfig;

  const { totalCodeEnergy, totalComplexMatches, lines } =
    getCodeEnergy(content);

  if (totalComplexMatches <= complexMatchesToIgnore) {
    return false;
  }

  if (totalCodeEnergy < minTotalCodeEnergy) {
    return false;
  }

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
