"use strict";

// Shared player-name helpers used by the converters. Kept in one place so the
// accent translation table and the PES5 shirt-name spacing rules have a single
// source of truth.

/**
 * Accent character -> ASCII replacement map for shirt names.
 *
 * @type {Record<string, string>}
 */
const ACCENT_TRANSLATION_MAP = {
  // Romance (French, Spanish, Italian, Portuguese)
  Á: "A",
  À: "A",
  Â: "A",
  Ä: "A",
  Ã: "A",
  Å: "A",
  É: "E",
  È: "E",
  Ê: "E",
  Ë: "E",
  Í: "I",
  Ì: "I",
  Î: "I",
  Ï: "I",
  Ó: "O",
  Ò: "O",
  Ô: "O",
  Ö: "O",
  Ú: "U",
  Ù: "U",
  Û: "U",
  Ü: "U",
  Ñ: "N",
  Ç: "C",
  Ć: "C",

  // Polish
  Ę: "E",
  Ą: "A",
  Ś: "S",
  Ł: "L",
  Ń: "N",
  Ż: "Z",
  Ź: "Z",

  // Ex-Yugoslav / Czech / Slovak
  Š: "S", // Šuker, Vlašić
  Ž: "Z", // Živković
  Č: "C", // Čech, Perišić
  Ř: "R", // Řezník
  Ď: "D",
  Ť: "T",
  Ň: "N",
  Ě: "E",
  Ů: "U",
  Ľ: "L",
  Đ: "D", // U+0110 — Đoković, Đurić
  Ð: "D", // U+00D0 Icelandic eth, looks identical, different codepoint

  // Turkish
  Ğ: "G", // Güneş
  Ş: "S", // Şahin
  İ: "I", // U+0130 dotted capital I

  // Romanian (comma-below vs cedilla are DIFFERENT codepoints)
  Ă: "A",
  Ș: "S", // U+0218
  Ț: "T", // U+021A
  Ţ: "T", // U+0162 legacy cedilla form, still common in data

  // Nordic
  Ø: "O", // Ødegaard
  Æ: "AE",
  Ý: "Y",
  Þ: "TH",

  // Hungarian
  Ő: "O",
  Ű: "U",

  // Baltic
  Ā: "A",
  Ē: "E",
  Ī: "I",
  Ū: "U",
  Ō: "O",
  Ģ: "G",
  Ķ: "K",
  Ļ: "L",
  Ņ: "N",
  Ė: "E",
  Į: "I",
  Ų: "U",
};

/**
 * Return the player's last name, uppercased and with accents flattened to the
 * characters the PES editor understands. Named `shirtName` (not
 * `nameToShirtName`) so the converter classes can keep a thin delegating method
 * of that name without shadowing the free function.
 *
 * @param {string} name - Full player name.
 * @returns {string} Flattened, uppercase last name.
 */
function shirtName(name) {
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
 * @param {string} lastName - Already-flattened shirt name.
 * @returns {string} Space-padded shirt name.
 */
function formatPes5ShirtName(lastName) {
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
