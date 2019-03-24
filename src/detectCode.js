/* stripWrappedCode */

const stripWrappedCode = content => {
  const codeTypes = [
    /(^`{3,}).*\r?\n[\s\S]*\r?\n\1/gm, // backtick-fenced block
    /(^~{3,}).*\r?\n[\s\S]*\r?\n\1/gm, // tilde-fenced block
    /(?:^|(?:\r?\n{2,}))\s*(?:(?: {4}|\t).*(?:\r?\n|$))/g, // indented block
    // lack of `m` flag is intentional (`^` must match beginning of input, not line)

    /\[code.*\][\s\S]*\[\/code\]/gm, // BBCode tags

    /`.+`/g, // inline backticks (must come last)
  ];

  const strippedContent = codeTypes.reduce((str, codeType) => {
    return str.replace(codeType, '');
  }, content);

  return strippedContent;
};

/* matcher */

const varNameStart = '[$_a-zA-Z]';
const varNameEnd = '[$_a-zA-Z0-9]*';
const varName = `${varNameStart}${varNameEnd}`;
const xmlLikeName = '[a-zA-Z-]+';

const nonHtmlIndicators = [
  `[$_]${varName}`, // almost certain to be var name
  `${varName}(?:_${varName})+`, // snake_case
  // camelCase and spinal-case omitted due to too many false positives
  '(?:^|\\s+)(?:\\/\\/|;)', // single-line comment
  // ignore python-style `#` single-line comments due to conflict with md headings
  `\\/\\*[\\s\\S]+\\*\\/`, // C-like multiline comment
  `('''|""")[\\s\\S]+\\1`, // python-like multiline string/comment
  ';\\s*$', // trailing semicolon
  `${varName}\\((?:${varName})?\\)`, // function call
  `${varName}\\[(${varName}?)\\]`, // array index
  `${varName}\\.${varName}`, // object property
  '^\\s*[{}]\\s*$', // curly brace and nothing else on a line
  '\\{\\{.+\\}\\}', // templating languages e.g. handlebars
  '[$#]\\{.+\\}', // template string
  '&&|\\|\\||!=|>=|<=|=>|->|>>|<<|::'
  + '|\\+\\+|\\+=|-=|\\*=|\\/=|\\|=|&=|\\?=', // various operators
  '\\\\[\'"ntr0\\\\]', // common escape sequences
];

const htmlIndicators = [
  '<!--[\\s\\S]*?-->', // xml-like comment
  `<${xmlLikeName}.*\\/?>`, // xml-like start/empty tag
  `</${xmlLikeName}>`, // xml-like end tag
  '&([0-9a-zA-Z]+);$', // html entity - human-readable
  '&#([0-9]{1,7});$', // html entity - decimal
  '&#x([0-9a-fA-F]{1,6});$', // html entity - hex
];

const { include_html, matches_to_ignore } = settings;

const indicators = nonHtmlIndicators.concat(include_html ? htmlIndicators : [])
  .map(str => new RegExp(str, 'gm'));

const detectCode = content => {
  let matchCount = 0;

  for (let idx = 0; idx < indicators.length; idx++) {
    const indicator = indicators[idx];
    const matches = content.match(indicator);

    if (matches) matchCount += matches.length;

    if (matchCount > matches_to_ignore) return true;
  }

  return false;
};

const detectUnformattedCode = content => {
  const strippedContent = stripWrappedCode(content);
  return detectCode(strippedContent);
};
