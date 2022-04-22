const genderEmojiData = {
  masc: {
    adult: "👨",
    child: "👦",
    modifier: "\u200d♂",
  },
  fem: {
    adult: "👩",
    child: "👧",
    modifier: "\u200d♀",
  },
  // no widespread support for most gender-neutral emoji sequences yet :(
  // neutral: {
  //   adult: "🧑",
  //   child: "🧒",
  //   modifier: "",
  // },
};

const randomGenderEmojiData = () => {
  const genders = Object.values(genderEmojiData);

  return genders[Math.floor(Math.random() * genders.length)];
};

const emojiRegexes = Object.keys(Object.values(genderEmojiData)[0]).reduce(
  (regexInfo, subStrType) => {
    regexInfo[subStrType] = new RegExp(
      Object.values(genderEmojiData)
        .map((gender) => gender[subStrType])
        .filter(Boolean)
        .join("|"),
      "g"
    );

    return regexInfo;
  },
  {}
);

export const randomizeEmojiGender = (emojis) =>
  Object.entries(emojiRegexes).reduce(
    (emoji, [subStrType, regex]) =>
      emoji.replace(regex, () => randomGenderEmojiData()[subStrType]),
    emojis
  );

const MIN_SKIN_TONE_CODEPOINT = 0x1f3fb;
const MAX_SKIN_TONE_CODEPOINT = 0x1f3ff;

export const randomizeEmojiSkinTone = (emoji) =>
  emoji.replace(/[\u{1f3fb}-\u{1f3ff}]/gu, () =>
    String.fromCodePoint(
      MIN_SKIN_TONE_CODEPOINT +
        Math.floor(
          Math.random() *
            (MAX_SKIN_TONE_CODEPOINT - MIN_SKIN_TONE_CODEPOINT + 1)
        )
    )
  );

export const randomizeEmojiDiversity = (emoji) =>
  randomizeEmojiSkinTone(randomizeEmojiGender(emoji));
