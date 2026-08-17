"use strict";

const PESMASTER_TEAM_PLAYER_LINK_SELECTOR =
  'a[href*="/efootball-2022/player/"]';

/**
 * Fatal error used when PESMaster explicitly refuses further requests.
 */
class PESMasterTeamBlockedError extends Error {
  /**
   * @param {number} status - HTTP status code.
   * @param {string} url - URL that failed.
   */
  constructor(status, url) {
    super(`PESMaster returned HTTP ${status} for ${url}`);
    this.name = "PESMasterTeamBlockedError";
  }
}

/**
 * Parser for a PESMaster team page.
 *
 * Its only responsibility is finding the player URLs belonging to the
 * normal first-team section. It deliberately stops before the next H2 so
 * lineup / legend / special-card sections are excluded.
 */
class PESMasterTeam {
  /**
   * @param {Document} doc - Parsed PESMaster team page.
   */
  constructor(doc) {
    /** @type {Document} */
    this.doc = doc;

    /** @type {string[]} */
    this.playerUrls = this.getPlayerUrls();
  }

  /**
   * Find the normal eFootball squad player URLs.
   *
   * @returns {string[]} Unique absolute player URLs.
   */
  getPlayerUrls() {
    const context = "pesmaster-team:players";

    const headings = all(this.doc, "h2");

    const squadHeadingIndex = headings.findIndex((heading) =>
      pesMasterClean(heading.textContent || "").endsWith("eFootball Players"),
    );

    if (squadHeadingIndex === -1) {
      throw new ScrapeError('heading ending with "eFootball Players"', context);
    }

    const squadHeading = headings[squadHeadingIndex];
    const nextHeading = headings[squadHeadingIndex + 1] || null;

    const playerUrls = [];

    for (const anchor of all(this.doc, PESMASTER_TEAM_PLAYER_LINK_SELECTOR)) {
      const isAfterSquadHeading = Boolean(
        squadHeading.compareDocumentPosition(anchor) &
        Node.DOCUMENT_POSITION_FOLLOWING,
      );

      if (!isAfterSquadHeading) {
        continue;
      }

      if (nextHeading) {
        const isBeforeNextHeading = Boolean(
          anchor.compareDocumentPosition(nextHeading) &
          Node.DOCUMENT_POSITION_FOLLOWING,
        );

        if (!isBeforeNextHeading) {
          continue;
        }
      }

      const href = anchor.getAttribute("href");

      if (!href) {
        continue;
      }

      const url = new URL(href, window.location.origin);

      // Content-script fetches still obey the same-origin policy.
      if (url.origin !== window.location.origin) {
        debugWarn(
          "pesmaster-team",
          "Skipping cross-origin player URL",
          url.href,
        );
        continue;
      }

      playerUrls.push(url.href);
    }

    const uniqueUrls = [...new Set(playerUrls)];

    if (uniqueUrls.length === 0) {
      throw new ScrapeError(PESMASTER_TEAM_PLAYER_LINK_SELECTOR, context);
    }

    debugLog("pesmaster-team", "player URLs", uniqueUrls);

    return uniqueUrls;
  }
}

/**
 * Async delay between PESMaster player requests.
 *
 * @param {number} milliseconds - Delay duration.
 * @returns {Promise<void>}
 */
function pesMasterTeamSleep(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

/**
 * Download and parse every player belonging to a PESMaster team.
 *
 * Requests are intentionally sequential. A two-second delay is inserted
 * between requests so importing one team does not hammer PESMaster.
 *
 * Individual player failures are recorded and skipped. HTTP 403 and 429 are
 * considered fatal because continuing would only generate more refused
 * requests.
 *
 * @param {Document} doc - Parsed team page.
 * @param {(current: number, total: number) => void} onProgress
 *   Progress callback.
 * @returns {Promise<BatchBuildResult>}
 */
async function pesMasterBuildTeamPlayers(doc, onProgress) {
  const team = new PESMasterTeam(doc);

  /** @type {Object[]} */
  const players = [];

  /** @type {string[]} */
  const failures = [];

  const parser = new DOMParser();
  const total = team.playerUrls.length;

  const requestDelayMs = await getBatchRequestDelay();

  debugLog("pesmaster-team", "batch request delay", requestDelayMs);

  onProgress(0, total);

  for (let i = 0; i < total; i++) {
    const url = team.playerUrls[i];

    try {
      debugLog("pesmaster-team", `fetching player ${i + 1}/${total}`, url);

      const response = await fetch(url, {
        credentials: "same-origin",
      });

      if (response.status === 403 || response.status === 429) {
        throw new PESMasterTeamBlockedError(response.status, url);
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const html = await response.text();

      const playerDocument = parser.parseFromString(html, "text/html");

      // Reuse the exact same scraper as a normal PESMaster player page.
      const player = new PESMasterPlayer(playerDocument);

      players.push(player);
    } catch (error) {
      // If PESMaster is rate-limiting / blocking us, stop immediately.
      if (error instanceof PESMasterTeamBlockedError) {
        throw error;
      }

      failures.push(url);

      debugWarn(
        "pesmaster-team",
        `failed player ${i + 1}/${total}`,
        url,
        error,
      );
    }

    onProgress(i + 1, total);

    // Do not delay after the final player.
    if (i < total - 1) {
      await pesMasterTeamSleep(requestDelayMs);
    }
  }

  return {
    items: players,
    failures: failures,
  };
}

window.PESConverter.registerSource({
  id: "pesmaster-team",

  converterMethod: "fromPesMasterPlayer",

  supportedFormats: [FORMAT.PES5, FORMAT.PES21],

  isSupported: function () {
    const isEnglish =
      document.querySelector("html")?.getAttribute("lang") === "en-US";

    const isTeamPage = /\/efootball-2022\/team\/\d+\/?$/.test(
      window.location.pathname,
    );

    return isEnglish && isTeamPage;
  },

  label: function () {
    if (document.querySelector("html")?.getAttribute("lang") !== "en-US") {
      return "Please Select English Language";
    }

    return "Add Team to CSV";
  },

  buttonStyle: function (style) {
    style.top = "50%";
    style.bottom = "auto";
    style.transform = "translateY(-50%)";
    style.minWidth = "210px";
  },

  buildMany: function (doc, onProgress) {
    return pesMasterBuildTeamPlayers(doc, onProgress);
  },
});
