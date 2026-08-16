"use strict";

// Pure, stateless math helpers shared across the converters. Extracted from
// core.js so the converters can depend on a single stable utility module.

/**
 * Return the larger of `value` and `compare` (i.e. clamp to a lower bound).
 *
 * @param {number} value - The value to clamp.
 * @param {number} compare - The minimum allowed value.
 * @returns {number} The larger of the two values.
 */
function atLeast(value, compare) {
  return value < compare ? compare : value;
}

/**
 * Integer division with rounding to nearest.
 *
 * @param {number} int1 - The dividend.
 * @param {number} int2 - The divisor.
 * @returns {number} The rounded integer quotient.
 */
function divideIntegers(int1, int2) {
  return Math.round(int1 / int2);
}

/**
 * Arithmetic mean of an array of numbers (0 for an empty array).
 *
 * @param {number[]} numbers - Array of values to average.
 * @returns {number} The arithmetic mean, or 0 if empty.
 */
function average(numbers) {
  if (numbers.length === 0) {
    return 0;
  }

  var sum = 0;
  for (var i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }

  return sum / numbers.length;
}

/**
 * Random integer in [min, max). The maximum is exclusive and the minimum is
 * inclusive.
 *
 * @param {number} min - Inclusive lower bound.
 * @param {number} max - Exclusive upper bound.
 * @returns {number} A random integer in [min, max).
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Cap a stat at 99, rounding non-integers to nearest. Note there is no lower
 * bound: negative values pass through unchanged.
 *
 * @param {number} stat - The raw stat value.
 * @returns {number} The stat capped at 99 and rounded.
 */
function limitStat99(stat) {
  return stat <= 99 ? Math.round(stat) : 99;
}

/**
 * Clamp `num` to the inclusive range [min, max].
 *
 * @param {number} min - Inclusive lower bound.
 * @param {number} max - Inclusive upper bound.
 * @param {number} num - The value to clamp.
 * @returns {number} The clamped value in [min, max].
 */
function clamp(min, max, num) {
  if (num < min) return min;
  else if (num > max) return max;
  return num;
}
