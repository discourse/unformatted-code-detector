import fs from "fs";
import path from "path";
import yaml from "js-yaml";

export const wrap = (str) => {
  return str.split("\n").length > 1 ? "```\n" + str + "\n```" : "`" + str + "`";
};

export const expectAll = (fn, tests, expected) => {
  tests.forEach((t) => {
    test(t.toString(), () => {
      expect(fn(t)).toBe(expected);
    });
  });
};

export const defaultSettings = Object.fromEntries(
  Object.entries(
    yaml.safeLoad(
      fs.readFileSync(path.join(__dirname, "../settings.yml"), "utf-8")
    )
  ).map(([k, v]) => [k, v.default])
);
