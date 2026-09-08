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
 * Render multiple converter results into CSV storage in one transaction.
 *
 * Batch sources always use CSV storage; clipboard mode is intentionally
 * ignored because a team represents multiple players.
 *
 * @param {ConverterResult[]} results - Converted players.
 * @param {Format} format - Output format.
 * @returns {Promise<void>}
 */
async function renderMany(results, format) {
  const rows = [];

  for (const result of results) {
    rows.push(result.csv());
  }

  await addPlayers(rows, format);
}

/**
 * Enable or disable the floating button while a batch operation is running.
 *
 * @param {HTMLButtonElement} button - Floating action button.
 * @param {boolean} busy - Whether the button is currently busy.
 * @returns {void}
 */
function setButtonBusy(button, busy) {
  button.disabled = busy;
  button.setAttribute("aria-busy", busy ? "true" : "false");
  button.style.cursor = busy ? "wait" : "pointer";
}

/**
 * The progress bar's fill color, as a CSS `var()` reference.
 * floating-button.css declares `--pes-indie-btn-progress` on the base rule
 * (so it's always defined) and overrides it per `[data-site]`. Read by both
 * `updateButtonProgress` and `finishButtonProgress` so the two never drift
 * apart.
 *
 * @type {string}
 */
const PROGRESS_COLOR_VAR = "var(--pes-indie-btn-progress)";

/**
 * Update the floating button so its background acts as a progress bar.
 *
 * @param {HTMLButtonElement} button - Floating action button.
 * @param {number} current - Completed players.
 * @param {number} total - Total players.
 * @returns {void}
 */
function updateButtonProgress(button, current, total) {
  const percentage = total === 0 ? 0 : Math.round((current / total) * 100);

  button.textContent = `Converting ${current}/${total} (${percentage}%)`;

  // Use background-size rather than changing gradient stops.
  // This lets us smoothly reverse the animation after completion. The color
  // itself comes from --pes-indie-btn-progress (set per site alongside
  // --pes-indie-btn-bg) so the progress fill stays visible against
  // whichever accent color the active site is themed with.
  button.style.backgroundImage = `linear-gradient(${PROGRESS_COLOR_VAR}, ${PROGRESS_COLOR_VAR})`;

  button.style.backgroundRepeat = "no-repeat";
  button.style.backgroundPosition = "left center";
  button.style.backgroundSize = `${percentage}% 100%`;
  button.style.transition = "background-size 250ms linear";
}

/**
 * Clear the button's progress-bar styling.
 *
 * @param {HTMLButtonElement} button - Floating action button.
 * @returns {void}
 */
function clearButtonProgress(button) {
  button.style.backgroundImage = "";
  button.style.backgroundRepeat = "";
  button.style.backgroundPosition = "";
  button.style.backgroundSize = "";
  button.style.transition = "";
}

/**
 * Show the batch result for five seconds while draining the progress bar,
 * then restore the original source button.
 *
 * @param {HTMLButtonElement} button - Floating action button.
 * @param {string} originalLabel - Label to restore after the cooldown.
 * @returns {void}
 */
function finishButtonProgress(button, originalLabel) {
  const cooldownMs = 3000;

  // Ensure the completion bar begins completely full.
  button.style.backgroundImage = `linear-gradient(${PROGRESS_COLOR_VAR}, ${PROGRESS_COLOR_VAR})`;

  button.style.backgroundRepeat = "no-repeat";
  button.style.backgroundPosition = "left center";

  // Disable transition while forcing the bar to 100%.
  button.style.transition = "none";
  button.style.backgroundSize = "100% 100%";

  // Force the browser to apply the 100% state before starting
  // the reverse animation.
  button.getBoundingClientRect();

  // Drain from 100% to 0% over five seconds.
  button.style.transition = `background-size ${cooldownMs}ms linear`;

  button.style.backgroundSize = "0% 100%";

  setTimeout(function () {
    clearButtonProgress(button);

    button.textContent = originalLabel;

    setButtonBusy(button, false);
  }, cooldownMs);
}

/**
 * Derive the button's theme key from a source id, so "sofifa" and
 * "sofifa-team" share the same [data-site] styling in floating-button.css.
 *
 * @param {string} sourceId - The active source's id (e.g. "sofifa-team").
 * @returns {string} The site key (e.g. "sofifa").
 */
function buttonThemeSite(sourceId) {
  return sourceId.replace(/-team$/, "");
}

/**
 * Mount the floating action button for a source.
 *
 * @param {SourceDescriptor} source - The source to bind.
 * @returns {void}
 */
function mountButton(source) {
  const button = document.createElement("button");
  button.classList.add("pes-indie-floating-button");
  button.dataset.site = buttonThemeSite(source.id);

  /**
   * Reset the button to this source's default fixed layout (bottom-right,
   * or whatever `source.buttonStyle` overrides it to).
   *
   * @returns {void}
   */
  function applySourceDefaultPosition() {
    // Routed through applyButtonPosition (rather than hard-coding the
    // offset here) so the default layout can never drift from
    // BUTTON_POSITION_OFFSET_PX in lib/core.js.
    applyButtonPosition(button.style, BUTTON_POSITION.BOTTOM_RIGHT);
    // Max signed 32-bit int: keeps the button above page content regardless
    // of any stacking context the host page's own elements establish.
    button.style.zIndex = "2147483647";

    // Sources may override position/layout (e.g. PESMaster is vertically
    // centered instead of bottom-anchored).
    if (source.buttonStyle) {
      source.buttonStyle(button.style);
    }
  }

  applySourceDefaultPosition();

  button.innerHTML = source.label();

  // A user-selected position overrides the site's default layout above.
  // Absent from storage means "keep the site's default position".
  chrome.storage.local.get(
    ["selectButtonPosition"],
    /** @param {PESStorageData} result */ function (result) {
      if (result.selectButtonPosition) {
        applyButtonPosition(button.style, result.selectButtonPosition);
      }
    },
  );

  // Re-apply live when the setting changes from the popup, so an already-open
  // page reflects the new position without needing a reload.
  chrome.storage.onChanged.addListener(
    /**
     * @param {{ [key: string]: chrome.storage.StorageChange }} changes
     * @param {chrome.storage.AreaName} areaName
     * @returns {void}
     */
    function (changes, areaName) {
      if (areaName !== "local" || !changes.selectButtonPosition) {
        return;
      }

      const newPosition = /** @type {ButtonPosition|undefined} */ (
        changes.selectButtonPosition.newValue
      );

      if (newPosition) {
        applyButtonPosition(button.style, newPosition);
      } else {
        // Reverted to "Auto".
        applySourceDefaultPosition();
      }
    },
  );

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

    // Batch imports can take around a minute. Prevent starting another
    // import while the current one is still running.
    if (source.buildMany) {
      setButtonBusy(button, true);
    }

    chrome.storage.local.get(
      ["selectOptionFMInside", "selectCopyMode", "debugEnabled"],

      /**
       * Storage callback: convert and render using stored settings.
       *
       * @param {PESStorageData} result - Stored settings object.
       * @returns {Promise<void>} Resolves when the render is complete.
       */
      async function (result) {
        const format = result.selectOptionFMInside || FORMAT.PES5;
        const copyMode = result.selectCopyMode || COPY_MODE.ONE;
        // Sync the persisted debug preference to the logger's global gate.
        window.PES_DEBUG = result.debugEnabled === true;
        debugLog("bootstrap", "settings", { format, copyMode });

        const parser = new DOMParser();
        const doc = parser.parseFromString(
          document.documentElement.outerHTML,
          "text/html",
        );

        // Reject unsupported formats before doing any network work.
        // This is especially important for team imports: we do not want to
        // download 30 players only to discover that PES13 is unsupported.
        if (!source.supportedFormats.includes(format)) {
          debugWarn("bootstrap", "format not supported by source", format);

          button.textContent = "Format not supported";

          setButtonBusy(button, false);

          return;
        }

        try {
          /*
           * Batch source.
           *
           * PESMaster team pages enter here. buildMany() downloads and parses
           * each player but deliberately does NOT convert them. Conversion stays
           * centralized here exactly like the single-player path.
           */
          if (source.buildMany) {
            const batch = await source.buildMany(
              doc,
              function (current, total) {
                updateButtonProgress(button, current, total);
              },
            );

            /** @type {ConverterResult[]} */
            const outputs = [];

            for (const scraped of batch.items) {
              const output = convert(source, scraped, format);

              if (output) {
                outputs.push(output);
              }
            }

            if (outputs.length === 0) {
              clearButtonProgress(button);

              button.textContent = "No players converted";

              setButtonBusy(button, false);

              return;
            }

            // output.csv() eventually calls the converter's csvString().
            await renderMany(outputs, format);

            if (batch.failures.length > 0) {
              button.textContent =
                `${outputs.length} added - ` +
                `${batch.failures.length} failed`;
            } else {
              button.textContent = `${outputs.length} players added`;
            }

            debugLog("bootstrap", "team import complete", {
              converted: outputs.length,
              failed: batch.failures,
            });

            // Keep the result visible for five seconds while the progress
            // bar drains backwards, then restore "Add Team to CSV".
            finishButtonProgress(button, source.label());

            return;
          }

          /*
           * Normal single-player source.
           */
          if (!source.build) {
            throw new Error(
              `Source "${source.id}" has neither build nor buildMany`,
            );
          }

          const scraped = source.build(doc);

          const output = convert(source, scraped, format);

          if (!output) {
            debugWarn("bootstrap", "no converter for", format);

            return;
          }

          debugLog("bootstrap", "psd", output.psd());

          render(output, format, copyMode);
        } catch (error) {
          clearButtonProgress(button);

          debugWarn("bootstrap", "source processing failed", error);

          if (source.buildMany) {
            button.textContent = "Team import failed - see console";

            setButtonBusy(button, false);

            return;
          }

          if (error instanceof ScrapeError) {
            button.textContent = "Scrape failed - see console";

            return;
          }

          throw error;
        }
      },
    );
  });

  document.body.appendChild(button);
}

// Sync the persisted debug preference to the logger's global gate at startup,
// so early debug output (before any button click) is gated the same way.
chrome.storage.local.get(
  ["debugEnabled"],
  /** @param {PESStorageData} result */ function (result) {
    window.PES_DEBUG = result.debugEnabled === true;
  },
);

const source = firstSourceThatMatches();
if (source) {
  mountButton(source);
}
