export const stripIgnoredContent = (content) => {
  const ignoredContents = [
    // properly formatted code
    /(^([`~])\2{2,})[^`~\r\n]*\r?\n[\s\S]*?\r?\n\1\2*\s*(?:\r?\n|$)/gm, // backtick-/tilde-fenced block
    /(?:^|(?:\r?\n{2,}))\s*(?:(?: {4}|\t).*(?:\r?\n|$))/g, // indented block
    // lack of `m` flag is intentional (`^` must match beginning of input, not line)

    /`[^`\r\n]+`/g, // inline backticks (must come after fenced code blocks)

    /\[([a-z]+).*?\][\s\S]*?\[\/\1\]/gim, // BBCode tags

    // URLs
    /https?:\/\/(_\([^() \r\n\t]+\)|[^() \r\n\t])+/g, // parens/underscores
    // for Wikipedia-style URLs

    // emojis
    /:[a-z_+-][a-z_0-9+-]*:/g, // descriptive style, e.g. :wink:, :stuck_out_tongue:
    /:D|:-D|:\)|:-\)|;\)|;-\)|:\(|:-\(|:o|:-o|:\?|:-\?|:\?\?\?:|8\)|8-\)|:x|:-x|:P|:-P|:!:|:\?:|:\||:-\||^_^|^__^|:'\(|:'-\(|:-'\(|:p|:O|:-O|:\/|;P|;-P|:\$|:-\$/g, // emoticon style, e.g. ;), :-P
    // per https://github.com/discourse/discourse/blob/dc6b547ed89f652b5406489d76140b76cf8e0d1d/script/import_scripts/phpbb3/support/smiley_processor.rb#L36-L63 and https://github.com/discourse/discourse/blob/0eeedf307a8f2a8e1ccd5b24dafbf5a7fd20e51e/lib/emoji/db.json#L7015-L7042

    // misc
    /\((?:c|tm|r)\)/gi, // copy/trademark/registered
  ];

  const strippedContent = ignoredContents.reduce((str, ignoredContent) => {
    return str.replace(ignoredContent, "");
  }, content);

  return strippedContent;
};
