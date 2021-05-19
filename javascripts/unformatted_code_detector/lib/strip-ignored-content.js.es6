const ignoredContents = [
  // PROPERLY FORMATTED CODE
  // - backtick/tilde-fenced block
  /(^([`~])\2{2,})[^`~\r\n]*\r?\n[\s\S]*?\r?\n\1\2*\s*(?:\r?\n|$)/gm,
  // - indented block (lack of `m` flag is intentional, `^` must match beginning of input, not line)
  /(?:^|(?:\r?\n{2,}))\s*(?:(?: {4}|\t).*(?:\r?\n|$))/g,
  // - inline backticks (must come after fenced code blocks)
  /`[^`\r\n]+`/g,

  // BBCODE TAGS
  /\[([a-z]+).*?\][\s\S]*?\[\/\1\]/gim,

  // UPLOADS
  /!?\[[^\]]+?\]\(upload:\/\/[\w.]+?\)(?: \([\d,.]+ \w+\))?/g,

  // URLs
  // - parens/underscores (for Wikipedia-style URLs)
  /https?:\/\/(_\([^() \r\n\t]+\)|[^() \r\n\t])+/g,

  // EMOJIS
  // - descriptive style (e.g. :wink: or :stuck_out_tongue:)
  /:[a-z_+-][a-z_0-9+-]*:/g,
  // - emoticon style (eg. ;) or :-P)
  /:D|:-D|:\)|:-\)|;\)|;-\)|:\(|:-\(|:o|:-o|:\?|:-\?|:\?\?\?:|8\)|8-\)|:x|:-x|:P|:-P|:!:|:\?:|:\||:-\||^_^|^__^|:'\(|:'-\(|:-'\(|:p|:O|:-O|:\/|;P|;-P|:\$|:-\$/g,

  // MISC
  // - copy/trademark/registered
  /\((?:c|tm|r)\)/gi,
];

export const stripIgnoredContent = (content) => {
  return ignoredContents.reduce((s, ignored) => s.replace(ignored, ""), content);
};
