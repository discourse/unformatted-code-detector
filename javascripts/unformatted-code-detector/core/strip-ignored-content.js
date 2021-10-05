const ignoredContents = [
  // properly formatted code
  /(^([`~])\2{2,})[^`~\n]*\n[\s\S]*?\n\1\2*\s*(?:\n|$)/gm, // backtick-/tilde-fenced block
  /(?:^|(?:\n{2,}))\s*(?:(?: {4}|\t).*(?:\n|$))/g, // indented block
  // lack of `m` flag is intentional (`^` must match beginning of input, not line)

  /`[^`\n]+`/g, // inline backticks (must come after fenced code blocks)

  /\[([a-z]+).*?\][\s\S]*?\[\/\1\]/gim, // BBCode tags

  // URLs
  /https?:\/\/(_\([^() \n\t]+\)|[^() \n\t])+/g, // parens/underscores
  // for Wikipedia-style URLs

  // emojis
  /:[a-z_+-][a-z_0-9+-]*:/g, // descriptive style, e.g. :wink:, :stuck_out_tongue:
  /:D|:-D|:\)|:-\)|;\)|;-\)|:\(|:-\(|:o|:-o|:\?|:-\?|:\?\?\?:|8\)|8-\)|:x|:-x|:P|:-P|:!:|:\?:|:\||:-\||^_^|^__^|:'\(|:'-\(|:-'\(|:p|:O|:-O|:\/|;P|;-P|:\$|:-\$/g, // emoticon style, e.g. ;), :-P
  // per https://github.com/discourse/discourse/blob/dc6b547ed89f652b5406489d76140b76cf8e0d1d/script/import_scripts/phpbb3/support/smiley_processor.rb#L36-L63 and https://github.com/discourse/discourse/blob/0eeedf307a8f2a8e1ccd5b24dafbf5a7fd20e51e/lib/emoji/db.json#L7015-L7042

  // misc
  /\((?:c|tm|r)\)/gi, // copy/trademark/registered

  // markdown links and images
  /!?\[[^\]]+\]\([[^\)]+\)/g,

  // mentions (Prefixed by non-word and terminated at word boundary)
  /\B@[\w][\w.-]{0,58}\b/g,
];

export const stripIgnoredContent = (content) => {
  const strippedContent = ignoredContents.reduce((str, ignoredContent) => {
    return str.replace(ignoredContent, "");
  }, content);

  return strippedContent;
};
