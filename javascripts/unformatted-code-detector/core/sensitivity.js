export const applySensitivity =
  (sensitivity) => (leastSensitive, mostSensitive) =>
    leastSensitive + sensitivity * (mostSensitive - leastSensitive);

export const sensitivityConfig = {
  get complexMatchesToIgnore() {
    return Math.round(applySensitivity(settings.sensitivity)(4, 0));
  },

  get minSequentialLinesToMatch() {
    return Math.round(applySensitivity(settings.sensitivity)(5, 1));
  },

  get minTotalCodeEnergy() {
    return Math.round(applySensitivity(settings.sensitivity)(5, 1));
  },
};
