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
