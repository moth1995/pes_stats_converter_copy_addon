"use strict";

// Layout selectors for the PESMaster player page, kept together so a site
// redesign is a single edit here rather than a hunt through the methods.
const PESMASTER_SELECTOR = Object.freeze(
  /** @type {const} */ ({
    NAME: ".top-header span:not([class])",
    HEADER: ".top-header",
    INFO_TABLE:
      "body > div.main-wrapper > div > div.main-stats-cards-container.container-large.flex.flex-expand > div.player-main-column.player-info-column > table",
    STATS_CONTAINER:
      "body > div.main-wrapper > div > div.main-stats-cards-container.container-large.flex.flex-expand > div.flex.flex-column > div.stats-container > div",
    SKILLS_CONTAINER:
      "body > div.main-wrapper > div > div.main-stats-cards-container.container-large.flex.flex-expand > div.flex.flex-column > div.cards-container.flex.flex-expand",
    STAT_TABLE: "table.player-stats-modern",
    CHARACTERISTICS_TABLE: "table.player-info",
    POSITION_ROW: "div.player-positions-row",
    POSITION: "span.pos",
  }),
);

// eFootball -> PES21/20 stat scaling per category. Thanks to Mohamed2746,
// Evoweb user.
const PESMASTER_CATEGORY_SCALING = Object.freeze([
  Object.freeze({
    factor: 0.075,
    labels: [
      PESMASTER_STAT.OFFENSIVE_AWARENESS,
      PESMASTER_STAT.FINISHING,
      PESMASTER_STAT.KICKING_POWER,
    ],
  }),
  Object.freeze({
    factor: 0.0625,
    labels: [
      PESMASTER_STAT.BALL_CONTROL,
      PESMASTER_STAT.DRIBBLING,
      PESMASTER_STAT.TIGHT_POSSESSION,
      PESMASTER_STAT.BALANCE,
    ],
  }),
  Object.freeze({
    factor: 0.03,
    labels: [
      PESMASTER_STAT.HEADING,
      PESMASTER_STAT.JUMPING,
      PESMASTER_STAT.DEFENSIVE_AWARENESS,
      PESMASTER_STAT.TACKLING,
      PESMASTER_STAT.DEFENSIVE_ENGAGEMENT,
      PESMASTER_STAT.AGGRESSION,
    ],
  }),
  Object.freeze({
    factor: 0.105,
    labels: [
      PESMASTER_STAT.LOW_PASS,
      PESMASTER_STAT.LOFTED_PASS,
      PESMASTER_STAT.SET_PIECE_TAKING,
    ],
  }),
  Object.freeze({
    factor: 0.065,
    labels: [
      PESMASTER_STAT.SPEED,
      PESMASTER_STAT.ACCELERATION,
      PESMASTER_STAT.PHYSICAL_CONTACT,
      PESMASTER_STAT.STAMINA,
    ],
  }),
  Object.freeze({
    factor: 0.165,
    labels: [
      PESMASTER_STAT.GK_AWARENESS,
      PESMASTER_STAT.GK_CATCHING,
      PESMASTER_STAT.GK_PARRYING,
      PESMASTER_STAT.GK_REFLEXES,
      PESMASTER_STAT.GK_REACH,
    ],
  }),
]);

/**
 * Collapse the whitespace PESMaster pads its table cells with.
 *
 * @param {string} value - Raw cell text.
 * @returns {string} The cleaned value.
 */
function pesMasterClean(value) {
  return value.replace(/[\r\t\n]/gm, "").trim();
}

/**
 * Scraper for PESMaster eFootball player pages. Reads identity, stats,
 * special skills and positions from the page DOM.
 *
 * Required fields go through the throwing `require*` guards: a PESMaster
 * redesign must abort the scrape rather than yield a half-read player.
 */
class PESMasterPlayer {
  /**
   * @param {Document} doc - Parsed PESMaster player page document.
   */
  constructor(doc) {
    /** @type {Document} */
    this.doc = doc;
    /** @type {string} */
    this.name = "";
    /** @type {number} */
    this.overall = 0;
    /** @type {PesmasterInfoMap} */
    this.info = /** @type {PesmasterInfoMap} */ ({});
    /** @type {PesmasterStatMap} */
    this.stats = /** @type {PesmasterStatMap} */ ({});
    /** @type {PesmasterCharacteristicMap} */
    this.characteristics = /** @type {PesmasterCharacteristicMap} */ ({});
    /** @type {PesmasterSkillLabel[]} */
    this.specialStats = [];
    /** @type {string[]} */
    this.positions = [];

    this.getBasicInfo();
    this.getStats();
    this.getSpecialStats();
    this.getPositions();
  }

  /**
   * Read the name, overall rating, and the identity table.
   *
   * @returns {void}
   */
  getBasicInfo() {
    const context = "pesmaster:basic-info";

    this.name = requireText(this.doc, PESMASTER_SELECTOR.NAME, context);
    this.overall = requireInt(
      requireEl(this.doc, PESMASTER_SELECTOR.HEADER, context),
      "span",
      context,
    );

    const rows = all(
      requireEl(this.doc, PESMASTER_SELECTOR.INFO_TABLE, context),
      "tr",
    );

    /** @type {Record<string, string>} */
    const info = {};
    for (const row of rows) {
      const tds = all(row, "td");
      if (tds.length < 2) {
        throw new ScrapeError("info row with fewer than 2 cells", context);
      }

      const key = tds[0].textContent || "";
      let value = pesMasterClean(tds[1].textContent || "");
      if (key === PESMASTER_INFO.POSITION) {
        value = pesMasterClean(requireText(tds[1], "span", context));
      }
      info[key] = value;
    }

    this.info = /** @type {PesmasterInfoMap} */ (info);

    debugLog("pesmaster", { name: this.name, info: this.info });
  }

  /**
   * Read one numeric stat table into `dictionary`, applying the per-category
   * eFootball -> PES scaling.
   *
   * @param {Element} table - A `table.player-stats-modern` element.
   * @param {Record<string, number>} dictionary - Accumulator to fill.
   * @returns {void}
   */
  statTableToObject(table, dictionary) {
    const context = "pesmaster:stats";

    for (const row of all(table, "table tr")) {
      const tds = all(row, "td");
      if (tds.length < 2) {
        throw new ScrapeError("stat row with fewer than 2 cells", context);
      }

      // tds[0] is the value, tds[1] is the stat label.
      let value = parseInt(tds[0].textContent || "", 10);
      const key = pesMasterClean(tds[1].textContent || "");
      if (isNaN(value)) {
        throw new ScrapeError(`non-numeric stat "${key}"`, context);
      }

      for (const category of PESMASTER_CATEGORY_SCALING) {
        if (/** @type {readonly string[]} */ (category.labels).includes(key)) {
          value = limitStat99(value + value * category.factor);
          break;
        }
      }

      dictionary[key] = value;
    }
  }

  /**
   * Read the string-valued characteristics table into `dictionary`.
   *
   * @param {Element} table - The `table.player-info` element.
   * @param {Record<string, string>} dictionary - Accumulator to fill.
   * @returns {void}
   */
  characteristicsTableToObject(table, dictionary) {
    const context = "pesmaster:characteristics";

    for (const row of all(table, "table tr")) {
      const tds = all(row, "td");
      if (tds.length < 2) {
        throw new ScrapeError(
          "characteristics row with fewer than 2 cells",
          context,
        );
      }

      dictionary[pesMasterClean(tds[0].textContent || "")] = pesMasterClean(
        tds[1].textContent || "",
      );
    }
  }

  /**
   * Read every stat table plus the characteristics table into `this.stats`.
   *
   * Numeric stats and string characteristics deliberately share one dictionary,
   * which is why its type is an intersection.
   *
   * @returns {void}
   */
  getStats() {
    const context = "pesmaster:stats";
    const container = requireEl(
      this.doc,
      PESMASTER_SELECTOR.STATS_CONTAINER,
      context,
    );

    /** @type {Record<string, number>} */
    const stats = {};
    /** @type {Record<string, string>} */
    const characteristics = {};

    const statsTables = all(container, PESMASTER_SELECTOR.STAT_TABLE);
    if (statsTables.length === 0) {
      throw new ScrapeError(PESMASTER_SELECTOR.STAT_TABLE, context);
    }
    for (const table of statsTables) {
      this.statTableToObject(table, stats);
    }

    this.characteristicsTableToObject(
      requireEl(container, PESMASTER_SELECTOR.CHARACTERISTICS_TABLE, context),
      characteristics,
    );

    this.stats = /** @type {PesmasterStatMap} */ (stats);
    this.characteristics = /** @type {PesmasterCharacteristicMap} */ (
      characteristics
    );
    debugLog("pesmaster", "stats", this.stats);
  }

  /**
   * Read the special-skill / playing-style cards.
   *
   * @returns {void}
   */
  getSpecialStats() {
    const context = "pesmaster:special-stats";
    const container = requireEl(
      this.doc,
      PESMASTER_SELECTOR.SKILLS_CONTAINER,
      context,
    );

    this.specialStats = all(container, "li").map(
      (li) =>
        /** @type {PesmasterSkillLabel} */ (
          pesMasterClean(li.textContent || "")
        ),
    );
    debugLog("pesmaster", "specialStats", this.specialStats);
  }

  /**
   * Read the playable positions. A position counts only when its parent's
   * trailing class digit is non-zero (PESMaster's "is playable" marker).
   *
   * @returns {void}
   */
  getPositions() {
    const context = "pesmaster:positions";

    /** @type {string[]} */
    const positions = [];
    for (const row of all(this.doc, PESMASTER_SELECTOR.POSITION_ROW)) {
      for (const position of all(row, PESMASTER_SELECTOR.POSITION)) {
        const positionName = pesMasterClean(position.textContent || "");
        const marker = requireAttr(position.parentElement, "class", context);
        if (parseInt(marker.slice(-1), 10)) {
          positions.push(positionName);
        }
      }
    }

    this.positions = positions;
    debugLog("pesmaster", "positions", this.positions);
  }
}

window.PESConverter.registerSource({
  id: "pesmaster",
  converterMethod: "fromPesMasterPlayer",
  supportedFormats: [FORMAT.PES5, FORMAT.PES21],
  isSupported: function () {
    /**
     * @returns {boolean} True when the page is served in English.
     */
    return document.querySelector("html")?.getAttribute("lang") === "en-US";
  },
  label: function () {
    /**
     * @returns {string} The floating button label.
     */
    if (document.querySelector("html")?.getAttribute("lang") !== "en-US") {
      return "Please Select English Language";
    }
    return "PES Stats Copy";
  },
  buttonStyle: function (style) {
    /**
     * @param {CSSStyleDeclaration} style - The button's style object.
     * @returns {void}
     */
    // PESMaster is vertically centered rather than bottom-anchored.
    style.top = "50%";
    style.bottom = "auto";
    style.transform = "translateY(-50%)";
  },
  build: function (doc) {
    /**
     * @param {Document} doc - Parsed PESMaster page document.
     * @returns {PESMasterPlayer} The scraped player.
     */
    return new PESMasterPlayer(doc);
  },
});
