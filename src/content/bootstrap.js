"use strict";

// Single orchestrator for all content scripts. Sources (content/sources/*.js)
// register themselves via window.PESConverter.registerSource; this file reads
// the active source, mounts the floating button, and drives the shared
// convert + copy/CSV flow. Adding a new source only requires a new registry
// entry, not a copy of this flow.

const SOURCES = window.PESConverter._sources;

/**
 * @returns {SourceDescriptor|null} the first matching source, or the first
 *   registered source (to show its unsupported label), or null.
 */
function firstSourceThatMatches() {
  for (let i = 0; i < SOURCES.length; i++) {
    if (SOURCES[i].isSupported()) {
      return SOURCES[i];
    }
  }
  // Fall back to the first registered source so we can still show its
  // unsupported label (matches the original per-site button behavior).
  return SOURCES[0] || null;
}

/**
 * @param {string} format - "pes5", "pes13", or "pes21".
 * @returns {typeof PESPlayer | typeof PES13Player | typeof PES21Player | null}
 */
function converterFor(format) {
  if (format === "pes5") return PESPlayer;
  if (format === "pes13") return PES13Player;
  if (format === "pes21") return PES21Player;
  return null; // "raw"
}

/**
 * @param {SourceDescriptor} source
 * @param {Object} scraped - scraped player object.
 * @param {string} format - output format.
 * @returns {ConverterResult|null}
 */
function convert(source, scraped, format) {
  // Preserve each source's original supported formats (e.g. PESMaster is
  // pes5/pes21 only, and only FMInside offers "raw").
  if (!source.supportedFormats.includes(format)) {
    return null;
  }

  if (format === "raw") {
    // Raw mode uses the scraped object itself (its PSDString is the dump).
    // Only meaningful when the source exposes a PSDString.
    if (typeof scraped.PSDString !== "function") {
      return null;
    }
    return window.PESConverter.converterResult(scraped);
  }

  const ConverterClass = converterFor(format);
  if (!ConverterClass) {
    return null;
  }

  const converter = new ConverterClass();
  converter[source.converterMethod](scraped);
  return window.PESConverter.converterResult(converter);
}

/**
 * @param {ConverterResult} result
 * @param {string} format
 * @param {string} copyMode - "one" (clipboard) or "multiple" (CSV list).
 * @returns {void}
 */
function render(result, format, copyMode) {
  if (copyMode === "one") {
    CopyToClipboard(result.psd());
    return;
  }

  if (!result.csv) {
    debugWarn("bootstrap", "CSV output not available for", format);
    return;
  }

  if (format === "pes5") {
    AddPlayer(result.csv());
  } else if (format === "pes13") {
    AddPlayer13(result.csv());
  } else if (format === "pes21") {
    AddPlayer21(result.csv());
  } else {
    debugWarn("bootstrap", "unsupported CSV format", format);
  }
}

/**
 * @param {SourceDescriptor} source
 */
function mountButton(source) {
  const button = document.createElement("button");
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";

  // Sources may override position/layout (e.g. PESMaster is vertically
  // centered instead of bottom-anchored).
  if (source.buttonStyle) {
    source.buttonStyle(button.style);
  }

  button.innerHTML = source.label();

  button.addEventListener("click", function () {
    if (!source.isSupported()) {
      debugWarn("bootstrap", "source not supported", source.label());
      return;
    }

    debugLog("bootstrap", "button clicked", source.id);

    chrome.storage.local.get(
      ["selectOptionFMInside", "selectCopyMode"],
      function (result) {
        const format = result.selectOptionFMInside || "pes5";
        const copyMode = result.selectCopyMode || "one";
        debugLog("bootstrap", "settings", { format, copyMode });

        const parser = new DOMParser();
        const doc = parser.parseFromString(
          document.documentElement.outerHTML,
          "text/html",
        );

        const scraped = source.build(doc);
        const output = convert(source, scraped, format);
        if (!output) {
          debugWarn("bootstrap", "no converter for", format);
          return;
        }

        debugLog("bootstrap", "psd", output.psd());
        render(output, format, copyMode);
      },
    );
  });

  document.body.appendChild(button);
}

const source = firstSourceThatMatches();
if (source) {
  mountButton(source);
}
