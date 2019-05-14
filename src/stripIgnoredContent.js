const stripIgnoredContent = content => {
  const ignoredContents = [
    // properly formatted code
    /(^([`~])\2{2,})[^`~\r\n]*\r?\n[\s\S]*?\r?\n\1\2*\s*(?:\r?\n|$)/gm, // backtick-/tilde-fenced block
    /(?:^|(?:\r?\n{2,}))\s*(?:(?: {4}|\t).*(?:\r?\n|$))/g, // indented block
    // lack of `m` flag is intentional (`^` must match beginning of input, not line)

    /\[code(?: [^\]\r\n])\][\s\S]*\[\/code\]/gm, // BBCode tags

    /`[^`\r\n]+`/g, // inline backticks (must come last)

    // emojis
    /:[a-z_0-9+-]+:/g,

    // URLs
    /https?:\/\/(_\([^() \r\n\t]+\)|[^() \r\n\t])+/g, // parens/underscores
    // for Wikipedia-style URLs

    // misc
    /\((?:c|tm|r)\)/ig, // copy/trademark/registered
  ];

  const strippedContent = ignoredContents.reduce((str, ignoredContent) => {
    return str.replace(ignoredContent, '');
  }, content);

  return strippedContent;
};

module.exports = {
  stripIgnoredContent
};
