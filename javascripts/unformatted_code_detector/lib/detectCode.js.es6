import { stripIgnoredContent } from "./stripIgnoredContent";

const varNameStart = "[$_a-zA-Z]";
const varNameEnd = "[$_a-zA-Z0-9]*";
const varName = `${varNameStart}${varNameEnd}`;
const varFragment = `[$a-zA-Z]${varNameEnd}`; // no underscore at start
const xmlLikeName = "[a-zA-Z-]+";
const string = `(?:"(?:[^\\r\\n"\\\\]|\\\\[^\\r\\n])*"|'(?:[^\\r\\n'\\\\]|\\\\[^\\r\\n])*')`;
// adapted from http://wordaligned.org/articles/string-literals-and-regular-expressions
const numeric = "-?(?:0|[1-9]\\d*)(?:\\.\\d+)?(?:[eE][+-]?\\d+)?";
// adapted from https://www.json.org/
const argument = `(?:${varName}|${string}|${numeric})`;
// ignoring complex values due to complexity;
// bools, `null`s, and `undefined`s are already matched based on varName
const argList = `(?:\\s*${argument}\\s*(?:,\\s*${argument}\\s*)*|\\s*)`;
// matches 0 or more args; don't use on its own due to risk of infinite matches

const nonHtmlIndicators = [
  `\\$${varName}`, // almost certain to be var name
  `^\\s*\\.${xmlLikeName}`, // CSS class selectors
  `:${varName}`, // Ruby symbol
  // omitted: _varName starting with underscore (conflict with italics)
  `${varFragment}(?:_${varFragment})+`, // snake_case
  // ommitted: camelCase and spinal-case (too many false positives)
  "(?:^|\\s+)(?:\\/\\/|;)", // single-line comment
  // omitted: python-style `#` single-line comments and CSS ID selectors (conflict with md headings)
  `\\/\\*[\\s\\S]+?\\*\\/`, // C-like multiline comment
  `('''|""")[\\s\\S]+?\\1`, // Python-like multiline string/comment
  ";\\s*$", // trailing semicolon
  `(?:${varName})?[$_a-z]\\(${argList}\\)`, // function call
  // var name cannot end with uppercase to avoid `O(n)` false positive etc.
  `${varName}\\[\\s*${argument}?\\s*\\]`, // array index
  // omitted: object property (conflict with domain names, e.g. "google.com")
  "^\\s*[{}]\\s*$", // curly brace and nothing else on a line
  "\\{\\{.+\\}\\}", // templating languages e.g. Handlebars
  "[\\$#]\\{.+\\}", // template string
  "&&|!=|>>|<<|::|\\+=|-=|\\*=|\\/=|\\|\\|=|\\?=|\\.\\?", // various operators
  // omitted: ++ (conflict with C++, Notepad++, etc.)
  // omitted: || (conflict with empty table header row)
  "\\\\['\"ntr0\\\\]", // common escape sequences
  `<\\?[^>]*\\?>`, // PHP
  `<%[^>]*%>`, // ERB (Rails)
];

const htmlIndicators = [
  "<!--[\\s\\S]*?-->", // XML-like comment
  `<${xmlLikeName}[^>]*\\/?>`, // XML-like start/empty tag
  `</${xmlLikeName}>`, // XML-like end tag
  "&[0-9a-zA-Z]+;", // HTML entity - human-readable
  "&#[0-9]{1,7};", // HTML entity - decimal
  "&#x[0-9a-fA-F]{1,6};", // HTML entity - hex
];

const { include_html, matches_to_ignore } = settings;

const indicators = nonHtmlIndicators
  .concat(include_html ? htmlIndicators : [])
  .map((str) => new RegExp(str, "gm"));

const detectCode = (content) => {
  let matchCount = 0;

  for (let idx = 0; idx < indicators.length; idx++) {
    const indicator = indicators[idx];
    const matches = content.match(indicator);

    if (matches) matchCount += matches.length;

    if (matchCount > matches_to_ignore) return true;
  }

  return false;
};

export const detectUnformattedCode = (content) => {
  const strippedContent = stripIgnoredContent(content);
  return detectCode(strippedContent);
};
