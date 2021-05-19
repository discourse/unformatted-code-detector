const { sensitivity } = settings;

export const _applySensitivity = (sensitivity) => (
  leastSensitive,
  mostSensitive
) => leastSensitive + sensitivity * (mostSensitive - leastSensitive);

const applySensitivity = _applySensitivity(sensitivity);

export const complexMatchesToIgnore = Math.round(applySensitivity(4, 0));

export const minSequentialLinesToMatch = Math.round(applySensitivity(5, 1));

export const minTotalCodeEnergy = Math.round(applySensitivity(5, 1));
