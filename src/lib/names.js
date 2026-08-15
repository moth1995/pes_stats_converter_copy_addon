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

// Return the player's last name, uppercased and with accents flattened to the
// characters the PES editor understands. Named `ShirtName` (not
// `NameToShirtName`) so the converter classes can keep a thin delegating method
// of that name without shadowing the free function.
function ShirtName(name) {
  const nameParts = name.split(" ");
  const lastName = nameParts[nameParts.length - 1].toUpperCase();
  return Array.from(
    lastName,
    (char) => ACCENT_TRANSLATION_MAP[char] || char,
  ).join("");
}

// The old-gen PES (5/13) shirt-name editor pads short names with spaces so they
// display correctly. PES21 does not, so apply this spacing only on the PES5/13
// conversion path.
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
