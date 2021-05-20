import { defaultSettings } from "./utils";

describe("apply sensitivity", () => {
  jest.resetModules();

  global.settings = defaultSettings;

  const {
    _applySensitivity,
  } = require("../javascripts/unformatted_code_detector/lib/sensitivity.js.es6");

  test("lowest sensitivity", () => {
    expect(_applySensitivity(0)(1, 10)).toEqual(1);
  });

  test("highest sensitivity", () => {
    expect(_applySensitivity(1)(1, 10)).toEqual(10);
  });

  test("lowest sensitivity (higher = less sensitive)", () => {
    expect(_applySensitivity(0)(10, 1)).toEqual(10);
  });

  test("highest sensitivity (higher = less sensitive)", () => {
    expect(_applySensitivity(1)(10, 1)).toEqual(1);
  });

  test("middle sensitivity", () => {
    expect(_applySensitivity(0.5)(1, 9)).toEqual(5);
  });

  test("middle sensitivity (higher = less sensitive)", () => {
    expect(_applySensitivity(0.5)(9, 1)).toEqual(5);
  });

  test("mid-high sensitivity", () => {
    expect(_applySensitivity(0.75)(0, 4)).toEqual(3);
  });

  test("mid-high sensitivity (higher = less sensitive)", () => {
    expect(_applySensitivity(0.75)(4, 0)).toEqual(1);
  });

  test("mid-low sensitivity", () => {
    expect(_applySensitivity(0.25)(0, 4)).toEqual(1);
  });

  test("mid-low sensitivity (higher = less sensitive)", () => {
    expect(_applySensitivity(0.25)(4, 0)).toEqual(3);
  });
});
