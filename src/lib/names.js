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
 * Return the last whitespace-separated word of a full name, uppercased.
 * Shared by `shirtName` and `formatPes5ShirtName` so both start from the same
 * extraction (trim + collapse-safe split) instead of duplicating it.
 *
 * @param {string} name - Full player name.
 * @returns {string} Uppercased last name, not yet accent-flattened.
 */
function extractLastName(name) {
  const nameParts = name.trim().split(" ").filter(Boolean);
  return nameParts[nameParts.length - 1].toUpperCase();
}

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
  const lastName = extractLastName(name);
  return Array.from(
    lastName,
    (char) => ACCENT_TRANSLATION_MAP[char] || char,
  ).join("");
}

/**
 * Format a flattened shirt name for the old-gen PES (5/13) editor, which pads
 * short names with spaces. PES21 does not, so apply only on the PES5/13 path.
 *
 * Tries spacing if it fits: double-space for very short names, single-space for
 * mid-length. Accounts for multi-character mappings (Æ→"AE", Þ→"TH") by trying
 * the spacing and measuring the result before committing to it. Extracts the
 * last name and flattens accents itself, so callers pass the full raw name.
 *
 * @param {string} name - Full player name.
 * @returns {string} Space-padded, accent-flattened shirt name.
 */
function formatPes5ShirtName(name) {
  const lastName = extractLastName(name).split("");
  const glyphs = [];
  for (const char of lastName) {
    glyphs.push(ACCENT_TRANSLATION_MAP[char] || char);
  }

  const charCount = glyphs.join("").length;

  // Try double spacing for very short names.
  if (charCount < 5) {
    const withDoubleSpacing = glyphs.join("  ");
    if (withDoubleSpacing.length <= 15) {
      return withDoubleSpacing;
    }
  }

  // Try single spacing for mid-length names (threshold adjusted for multi-char glyphs).
  if (charCount < 12) {
    const withSingleSpacing = glyphs.join(" ");
    if (withSingleSpacing.length <= 15) {
      return withSingleSpacing;
    }
  }

  // No spacing, truncate if needed.
  const noSpacing = glyphs.join("");
  if (noSpacing.length > 15) {
    return noSpacing.slice(0, 15);
  }
  return noSpacing;
}
