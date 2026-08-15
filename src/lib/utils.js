"use strict";

// Pure, stateless math helpers shared across the converters. Extracted from
// core.js so the converters can depend on a single stable utility module.

/**
 * Return the larger of `value` and `compare` (i.e. clamp to a lower bound).
 *
 * @param value
 * @param compare
 * @returns
 */
function AtLeast(value, compare) {
  return value < compare ? compare : value;
}

/**
 * Integer division with rounding to nearest.
 *
 * @param int1
 * @param int2
 * @returns
 */
function DivideIntegers(int1, int2) {
  return Math.round(int1 / int2);
}

/**
 * Arithmetic mean of an array of numbers (0 for an empty array).
 *
 * @param numbers
 * @returns
 */
function Average(numbers) {
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
 * @param min
 * @param max
 * @returns
 */
function GetRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Clamp a stat to the PES1..99 range, rounding non-integers up.
 *
 * @param stat
 * @returns
 */
function LimitStat99(stat) {
  return stat <= 99 ? Math.round(stat) : 99;
}

/**
 * Clamp `num` to the inclusive range [min, max].
 *
 * @param min
 * @param max
 * @param num
 * @returns
 */
function clamp(min, max, num) {
  if (num < min) return min;
  else if (num > max) return max;
  return num;
}
