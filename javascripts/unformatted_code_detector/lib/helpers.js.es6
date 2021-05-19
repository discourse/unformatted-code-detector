export const getLineBoundaries = (str) => {
  const lineBoundaries = [];

  let cursor = -1;

  while (true) {
    lineBoundaries.push({ start: cursor + 1 });

    cursor = str.indexOf("\n", cursor + 1);

    lineBoundaries[lineBoundaries.length - 1].end =
      cursor === -1 ? str.length : cursor;

    lineBoundaries[lineBoundaries.length - 1].content = str.slice(
      lineBoundaries[lineBoundaries.length - 1].start,
      lineBoundaries[lineBoundaries.length - 1].end
    );

    if (cursor === -1) {
      break;
    }
  }

  return lineBoundaries;
};

export const isBetween = (start, end) => (point) => {
  return point >= start && point <= end;
};
