"use strict";

// DOM scraping guards. Content scripts scrape third-party sites that change
// their markup without notice, and there are two right answers to a missing
// node depending on the field:
//
//   textOf/attrOf/first/all/intOf  - optional fields. Return a safe fallback so
//                                    one cosmetic markup change cannot kill the
//                                    whole scrape.
//   requireEl/requireText/         - required fields. Throw ScrapeError, because
//   requireInt/requireAttr           a converted player built from a half-read
//                                    page is wrong data, and emitting wrong data
//                                    is worse than emitting none.
//
// Nothing catches ScrapeError at the call site: content/bootstrap.js catches it
// once, reports the failure on the button, and writes nothing.

/**
 * Thrown when a required element or value is missing from a scraped page,
 * meaning the site's markup changed and the scrape cannot be trusted.
 */
class ScrapeError extends Error {
  /**
   * @param {string} selector - The selector (or attribute) that did not resolve.
   * @param {string} context - Where the failure happened, e.g. "pesmaster:basic-info".
   */
  constructor(selector, context) {
    super(`[${context}] required node/value not found: ${selector}`);
    this.name = "ScrapeError";
    /** @type {string} */
    this.selector = selector;
    /** @type {string} */
    this.context = context;
  }
}

/**
 * Return the first element matching `selector`, or throw.
 *
 * @param {Document|Element} root - The root node to query within.
 * @param {string} selector - CSS selector to match.
 * @param {string} context - Scrape context, used in the error message.
 * @returns {Element} The matching element.
 * @throws {ScrapeError} When nothing matches.
 */
function requireEl(root, selector, context) {
  const el = root.querySelector(selector);
  if (!el) {
    throw new ScrapeError(selector, context);
  }
  return el;
}

/**
 * Return the trimmed text of the first element matching `selector`, or throw.
 *
 * @param {Document|Element} root - The root node to query within.
 * @param {string} selector - CSS selector to match.
 * @param {string} context - Scrape context, used in the error message.
 * @returns {string} The trimmed text content.
 * @throws {ScrapeError} When nothing matches or the text is empty.
 */
function requireText(root, selector, context) {
  const text = (requireEl(root, selector, context).textContent || "").trim();
  if (text === "") {
    throw new ScrapeError(`${selector} (empty text)`, context);
  }
  return text;
}

/**
 * Parse the text of the first element matching `selector` as an int, or throw.
 *
 * @param {Document|Element} root - The root node to query within.
 * @param {string} selector - CSS selector to match.
 * @param {string} context - Scrape context, used in the error message.
 * @returns {number} The parsed integer.
 * @throws {ScrapeError} When nothing matches or the text is not numeric.
 */
function requireInt(root, selector, context) {
  const parsed = parseInt(requireText(root, selector, context), 10);
  if (isNaN(parsed)) {
    throw new ScrapeError(`${selector} (not a number)`, context);
  }
  return parsed;
}

/**
 * Return an attribute value from an element, or throw.
 *
 * @param {Element|null} el - The element to read from.
 * @param {string} attribute - The attribute name.
 * @param {string} context - Scrape context, used in the error message.
 * @returns {string} The attribute value.
 * @throws {ScrapeError} When the element is missing or lacks the attribute.
 */
function requireAttr(el, attribute, context) {
  const value = el ? el.getAttribute(attribute) : null;
  if (value === null) {
    throw new ScrapeError(`@${attribute}`, context);
  }
  return value;
}

/**
 * Return the text content of the first element matching `selector`, or "".
 *
 * @param {Document|Element} root - The root node to query within.
 * @param {string} selector - CSS selector to match.
 * @returns {string} The trimmed text content, or "" if not found.
 */
function textOf(root, selector) {
  const el = root.querySelector(selector);
  return el?.textContent.trim() ?? "";
}

/**
 * Return the value of `attribute` on the first element matching `selector`,
 * or "".
 *
 * @param {Document|Element} root - The root node to query within.
 * @param {string} selector - CSS selector to match.
 * @param {string} attribute - The attribute name to read.
 * @returns {string} The attribute value, or "" if not found.
 */
function attrOf(root, selector, attribute) {
  const el = root.querySelector(selector);
  return el?.getAttribute(attribute) ?? "";
}

/**
 * Return the first element matching `selector`, or null.
 *
 * @param {Document|Element} root - The root node to query within.
 * @param {string} selector - CSS selector to match.
 * @returns {Element|null} The matching element, or null.
 */
function first(root, selector) {
  return root.querySelector(selector);
}

/**
 * Return all elements matching `selector` as an array (always an array).
 *
 * @param {Document|Element} root - The root node to query within.
 * @param {string} selector - CSS selector to match.
 * @returns {Element[]} Array of matching elements.
 */
function all(root, selector) {
  return Array.from(root.querySelectorAll(selector));
}

/**
 * Parse the text of the first element matching `selector` as an int, with a
 * fallback when the node is missing or the text is not numeric.
 *
 * @param {Document|Element} root - The root node to query within.
 * @param {string} selector - CSS selector to match.
 * @param {number} fallback - Value returned when parsing fails.
 * @returns {number} The parsed integer, or `fallback`.
 */
function intOf(root, selector, fallback) {
  const el = root.querySelector(selector);
  if (!el) return fallback;
  const parsed = parseInt(el.textContent, 10);
  return isNaN(parsed) ? fallback : parsed;
}
