"use strict";

// Single orchestrator for all content scripts. Sources (content/sources/*.js)
// register themselves via window.PESConverter.registerSource; this file reads
// the active source, mounts the floating button, and drives the shared
// convert + copy/CSV flow. Adding a new source only requires a new registry
// entry, not a copy of this flow.

const SOURCES = window.PESConverter._sources;

/**
 * Find the first source whose `isSupported()` returns true; fall back to the
 * first registered source (to show its unsupported label), or null.
 *
 * @returns {SourceDescriptor|null} The matching source, or null.
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
 * Resolve the converter class for a given output format.
 *
 * @param {Format} format - "pes5", "pes13", or "pes21".
 * @returns {typeof PESPlayer | typeof PES13Player | typeof PES21Player | null}
 *   The converter class, or null for "raw"/unknown formats.
 */
function converterFor(format) {
  if (format === FORMAT.PES5) return PESPlayer;
  if (format === FORMAT.PES13) return PES13Player;
  if (format === FORMAT.PES21) return PES21Player;
  return null; // "raw"
}

/**
 * Convert a scraped player into a render result for the requested format.
 *
 * @param {SourceDescriptor} source - The active content source.
 * @param {FMPlayer|FIFAPlayer|PESMasterPlayerShape|Object} scraped - Scraped player object.
 * @param {Format} format - Output format.
 * @returns {ConverterResult|null} The render result, or null if unsupported.
 */
function convert(source, scraped, format) {
  // Preserve each source's original supported formats (e.g. PESMaster is
  // pes5/pes21 only, and only FMInside offers "raw").
  if (!source.supportedFormats.includes(format)) {
    return null;
  }

  if (format === FORMAT.RAW) {
    // Raw mode uses the scraped object itself (its psdString is the dump).
    // Only meaningful when the source exposes a psdString.
    const rawSource = /** @type {Partial<ConverterPlayer>} */ (scraped);
    if (typeof rawSource.psdString !== "function") {
      return null;
    }
    return window.PESConverter.converterResult(
      /** @type {ConverterPlayer} */ (scraped),
    );
  }

  const ConverterClass = converterFor(format);
  if (!ConverterClass) {
    return null;
  }

  const converter = new ConverterClass();
  // The entry point is chosen per source at runtime, so this one lookup is
  // dynamic by design; the descriptor's `converterMethod` names it.
  const entryPoint = /** @type {Record<string, (player: *) => void>} */ (
    /** @type {unknown} */ (converter)
  )[source.converterMethod];
  entryPoint.call(converter, scraped);

  return window.PESConverter.converterResult(converter);
}

/**
 * Render a converter result to the clipboard or the CSV list.
 *
 * @param {ConverterResult} result - The normalized render result.
 * @param {Format} format - Output format.
 * @param {CopyMode} copyMode - "one" (clipboard) or "multiple" (CSV list).
 * @returns {void}
 */
function render(result, format, copyMode) {
  if (copyMode === COPY_MODE.ONE) {
    copyToClipboard(result.psd());
    return;
  }

  if (!result.csv) {
    debugWarn("bootstrap", "CSV output not available for", format);
    return;
  }

  if (format === FORMAT.PES5) {
    addPlayer(result.csv());
  } else if (format === FORMAT.PES13) {
    addPlayer13(result.csv());
  } else if (format === FORMAT.PES21) {
    addPlayer21(result.csv());
  } else {
    debugWarn("bootstrap", "unsupported CSV format", format);
  }
}

/**
 * Mount the floating action button for a source.
 *
 * @param {SourceDescriptor} source - The source to bind.
 * @returns {void}
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
    /**
     * Click handler: scrape the current page, convert, and render.
     *
     * @returns {void}
     */
    if (!source.isSupported()) {
      debugWarn("bootstrap", "source not supported", source.label());
      return;
    }

    debugLog("bootstrap", "button clicked", source.id);

    chrome.storage.local.get(
      ["selectOptionFMInside", "selectCopyMode"],

      /**
       * Storage callback: convert and render using stored settings.
       *
       * @param {PESStorageData} result - Stored settings object.
       * @returns {void}
       */
      function (result) {
        const format = result.selectOptionFMInside || FORMAT.PES5;
        const copyMode = result.selectCopyMode || COPY_MODE.ONE;
        debugLog("bootstrap", "settings", { format, copyMode });

        const parser = new DOMParser();
        const doc = parser.parseFromString(
          document.documentElement.outerHTML,
          "text/html",
        );

        // Scraping is the only step that can fail hard: a site markup change
        // makes the scraped player wrong rather than merely incomplete. Catch
        // it here, once, and write nothing rather than emit bad stats.
        let output;
        try {
          const scraped = source.build(doc);
          output = convert(source, scraped, format);
        } catch (error) {
          if (error instanceof ScrapeError) {
            debugWarn("bootstrap", "scrape failed", error.message);
            button.innerHTML = "Scrape failed - see console";
            return;
          }
          throw error;
        }

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
