const wrap = str => {
  return str.split('\n').length > 1
    ? '```\n' + str + '\n```'
    : '`' + str + '`';
};

const noCode = [
  'hello world',
  'just some _plain old italics_',
  'one _word_ italicized',
  'one *word* italicized',
  'one __word__ bolded',
  'one **word** bolded',
  '# an innocent heading',
  'google.com',
  'https://www.google.com',
  'semicolons; also,',
  'freeCodeCamp',
  'hyphenated-word',
  'C++',
  'Notepad++',
  'this is (just some stuff in brackets)',
  'this is(just some stuff in brackets, despite the typo)',
  '{ I just happen to like curly braces }',
  '\'',
  "\"",
  '\n',
  '\t',
  '\r',
  '\0',
  '\\',
  '$15',
  '||', // empty table heading
  'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Client-side_storage'
];

const withUnformattedCode = [
  'const a = $helloWorld',
  'const a = helloWorld;',
  '.my-class { background: red; }',
  ':symbol',
  'this_is_snake_case',
  'a snake_case var',
  '// a comment',
  '// www.google.com',
  '; an old-school comment',
  '/* this comment\nspans two lines */',
  '/* this comment doesn\'t */',
  '"""\nhooray for python\n"""',
  "'''\nhooray for python\n'''",
  'noArgs()',
  'oneArg(1)',
  'lotsOfArgs(1, "a", \'b\', onionSoup)',
  'myArr[15]',
  'myObj[\'prop\']',
  '{',
  '}',
  '{{templates}}',
  '${js}', // exclude backticks to bypass code markup stripping
  '"#{ruby}"',
  '1 && 2',
  'a != b',
  'a !== b',
  'exists.?maybeExists',
  'arr << item',
  '0b100 >> 2',
  'Double::Colons',
  'counter += 2',
  'counter -= 2',
  'counter *= 2',
  'counter /= 2',
  'maybeExists ||= definitelyExists',
  'maybeExists &&= definitelyExists',
  'casting ?= operator',
  '\\\'',
  "\\\"",
  '\\n',
  '\\t',
  '\\r',
  '\\0',
  '\\\\',
  '<? hello erb ?>',
  '<% hello php %>',
];

const withBareHTML = [
  '<!-- this\n is a \n comment -->',
  '<empty with="attributes">',
  '<empty-no-attributes>',
  '<tag>\nsome text\n</tag>',
  '<orphan>',
  '</orphan>',
  'one &amp; two',
  'three &#42; four',
  'five &#x2a; six',
];

const withFormattedCode = withUnformattedCode.map(wrap);

const withFormattedHTML = withBareHTML.map(wrap);

const expectAll = (fn, tests, expected) => {
  tests.forEach(t => {
    test(t.toString(), () => {
      expect(fn(t)).toBe(expected);
    });
  })
};

describe('With HTML', () => {
  jest.resetModules();
  global.settings = { include_html: true, matches_to_ignore: 0 };
  const { detectUnformattedCode } = require('../detectCode');

  expectAll(detectUnformattedCode, noCode, false);
  expectAll(detectUnformattedCode, withUnformattedCode, true);
  expectAll(detectUnformattedCode, withFormattedCode, false);
  expectAll(detectUnformattedCode, withBareHTML, true);
  expectAll(detectUnformattedCode, withFormattedHTML, false);
});

describe('Without HTML', () => {
  jest.resetModules();
  global.settings = { include_html: false, matches_to_ignore: 0 };
  const { detectUnformattedCode } = require('../detectCode');

  expectAll(detectUnformattedCode, withBareHTML, false);
});
