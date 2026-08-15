"use strict";

// Shared player-name helpers used by the converters. Kept in one place so the
// accent translation table and the PES5 shirt-name spacing rules have a single
// source of truth.

const ACCENT_TRANSLATION_MAP = {
  Á: "A",
  À: "A",
  É: "E",
  È: "E",
  Í: "I",
  Ì: "I",
  Ó: "O",
  Ò: "O",
  Ú: "U",
  Ù: "U",
  Ü: "U",
  Ñ: "N",
  Ć: "C",
  Â: "A",
  Ä: "A",
  Ê: "E",
  Ë: "E",
  Î: "I",
  Ï: "I",
  Ô: "O",
  Ö: "O",
  Û: "U",
  Ç: "C",
  Å: "A",
  Ã: "A",
};

/**
 * Return the player's last name, uppercased and with accents flattened to the
 * characters the PES editor understands. Named `ShirtName` (not
 * `NameToShirtName`) so the converter classes can keep a thin delegating method
 * of that name without shadowing the free function.
 *
 * @param name - Full player name.
 * @returns Flattened, uppercase last name.
 */
function ShirtName(name) {
  const nameParts = name.split(" ");
  const lastName = nameParts[nameParts.length - 1].toUpperCase();
  return Array.from(
    lastName,
    (char) => ACCENT_TRANSLATION_MAP[char] || char,
  ).join("");
}

/**
 * Format a flattened shirt name for the old-gen PES (5/13) editor, which pads
 * short names with spaces. PES21 does not, so apply only on the PES5/13 path.
 *
 * @param lastName - Already-flattened shirt name.
 * @returns Space-padded shirt name.
 */
function FormatPES5ShirtName(lastName) {
  let formatted = lastName;
  if (formatted.length > 16) {
    formatted = formatted.slice(0, 15);
  } else if (formatted.length < 5) {
    formatted = formatted.split("").join("  ");
  } else if (formatted.length < 9) {
    formatted = formatted.split("").join(" ");
  }
  return formatted;
}
