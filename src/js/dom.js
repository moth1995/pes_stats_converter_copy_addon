"use strict";

// DOM scraping guards. Content scripts scrape third-party sites that change
// their markup without notice. A missing selector must never throw and kill
// the whole script: these helpers return safe fallbacks instead.

// Return the text content of the first element matching `selector`, or "".
function textOf(root, selector) {
  const el = root.querySelector(selector);
  return el ? el.textContent.trim() : "";
}

// Return the value of `attribute` on the first element matching `selector`,
// or "".
function attrOf(root, selector, attribute) {
  const el = root.querySelector(selector);
  return el ? el.getAttribute(attribute) : "";
}

// Return the first element matching `selector`, or null.
function first(root, selector) {
  return root.querySelector(selector);
}

// Return all elements matching `selector` as an array (always an array).
function all(root, selector) {
  return Array.from(root.querySelectorAll(selector));
}

// Parse the text of the first element matching `selector` as an int, with a
// fallback when the node is missing or the text is not numeric.
function intOf(root, selector, fallback) {
  const el = root.querySelector(selector);
  if (!el) return fallback;
  const parsed = parseInt(el.textContent, 10);
  return isNaN(parsed) ? fallback : parsed;
}
