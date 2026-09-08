"use strict";

// Closed vocabularies for the PES output domain: position codes, foot, favoured
// side, and grade letters. Each is a frozen-by-convention constant object plus a
// derived literal-union typedef, so a typo like "CTB" is a type error rather
// than a silently wrong stat.
//
// Existing string literals in the converters stay as-is: "CBT" is assignable to
// Pes5Position, so these objects are the single source of truth for the
// vocabulary while the unions do the checking.

/**
 * PES5 / WE9 position codes, in editor slot order.
 */
const PES5_POSITION = Object.freeze(
  /** @type {const} */ ({
    GK: "GK",
    CWP: "CWP",
    CBT: "CBT",
    SB: "SB",
    DMF: "DMF",
    WB: "WB",
    CMF: "CMF",
    SMF: "SMF",
    AMF: "AMF",
    WF: "WF",
    SS: "SS",
    CF: "CF",
  }),
);

/** @typedef {typeof PES5_POSITION[keyof typeof PES5_POSITION]} Pes5Position */

/**
 * PES13 position codes, in editor slot order. Same vocabulary as PES21 plus the
 * sweeper slot (SW), which PES21 dropped.
 */
const PES13_POSITION = Object.freeze(
  /** @type {const} */ ({
    GK: "GK",
    SW: "SW",
    CB: "CB",
    LB: "LB",
    RB: "RB",
    DMF: "DMF",
    CMF: "CMF",
    LMF: "LMF",
    RMF: "RMF",
    AMF: "AMF",
    LWF: "LWF",
    RWF: "RWF",
    SS: "SS",
    CF: "CF",
  }),
);

/** @typedef {typeof PES13_POSITION[keyof typeof PES13_POSITION]} Pes13Position */

/**
 * PES21 / PES20 position codes, in editor slot order.
 */
const PES21_POSITION = Object.freeze(
  /** @type {const} */ ({
    GK: "GK",
    CB: "CB",
    LB: "LB",
    RB: "RB",
    DMF: "DMF",
    CMF: "CMF",
    LMF: "LMF",
    RMF: "RMF",
    AMF: "AMF",
    LWF: "LWF",
    RWF: "RWF",
    SS: "SS",
    CF: "CF",
  }),
);

/** @typedef {typeof PES21_POSITION[keyof typeof PES21_POSITION]} Pes21Position */

/**
 * Any position code the converters may hold. PES13Player extends PESPlayer but
 * stores PES13/21-style codes in the inherited `registeredPosition`/`positions`
 * fields, so parent and child must share one type or the override is rejected.
 *
 * @typedef {Pes5Position|Pes13Position|Pes21Position} PESPositionCode
 */

/**
 * A position code as PES21 stores it in `positions`, where entries coming from
 * the FIFA and FM paths carry a "*" prefix but the PESMaster path does not.
 *
 * @typedef {PESPositionCode|`*${PESPositionCode}`} Pes21PositionEntry
 */

/**
 * Strong foot.
 */
const FOOT = Object.freeze(
  /** @type {const} */ ({
    LEFT: "L",
    RIGHT: "R",
  }),
);

/** @typedef {typeof FOOT[keyof typeof FOOT]} Foot */

/**
 * Favoured side. "B" means both.
 */
const FAVOURED_SIDE = Object.freeze(
  /** @type {const} */ ({
    BOTH: "B",
    LEFT: "L",
    RIGHT: "R",
  }),
);

/** @typedef {typeof FAVOURED_SIDE[keyof typeof FAVOURED_SIDE]} FavouredSide */

/**
 * Letter grade used for PES5/13 injury tolerance and other A-C ratings.
 */
const GRADE = Object.freeze(
  /** @type {const} */ ({
    A: "A",
    B: "B",
    C: "C",
  }),
);

/** @typedef {typeof GRADE[keyof typeof GRADE]} Grade */

/**
 * Output format, as stored under `selectOptionFMInside` and declared by each
 * source descriptor's `supportedFormats`.
 */
const FORMAT = Object.freeze(
  /** @type {const} */ ({
    PES5: "pes5",
    PES13: "pes13",
    PES21: "pes21",
    RAW: "raw",
  }),
);

/** @typedef {typeof FORMAT[keyof typeof FORMAT]} Format */

/**
 * Copy mode, as stored under `selectCopyMode`. "one" copies a single player to
 * the clipboard; "multiple" appends a row to the CSV list.
 */
const COPY_MODE = Object.freeze(
  /** @type {const} */ ({
    ONE: "one",
    MULTIPLE: "multiple",
  }),
);

/** @typedef {typeof COPY_MODE[keyof typeof COPY_MODE]} CopyMode */

/**
 * Floating button screen position, as stored under `selectButtonPosition`. A
 * 3x3 grid of every edge/corner plus center - the button never needs finer
 * placement than that. Absent from storage means "use the site's default
 * position" (see content/bootstrap.js).
 */
const BUTTON_POSITION = Object.freeze(
  /** @type {const} */ ({
    TOP_LEFT: "top-left",
    TOP_CENTER: "top-center",
    TOP_RIGHT: "top-right",
    MIDDLE_LEFT: "middle-left",
    MIDDLE_CENTER: "middle-center",
    MIDDLE_RIGHT: "middle-right",
    BOTTOM_LEFT: "bottom-left",
    BOTTOM_CENTER: "bottom-center",
    BOTTOM_RIGHT: "bottom-right",
  }),
);

/** @typedef {typeof BUTTON_POSITION[keyof typeof BUTTON_POSITION]} ButtonPosition */

/**
 * Popup color theme, as stored under `selectColorTheme`. "auto" follows the
 * system's `prefers-color-scheme` (the default); "light"/"dark" force the
 * popup's `data-theme` attribute regardless of system setting.
 */
const COLOR_THEME = Object.freeze(
  /** @type {const} */ ({
    AUTO: "auto",
    LIGHT: "light",
    DARK: "dark",
  }),
);

/** @typedef {typeof COLOR_THEME[keyof typeof COLOR_THEME]} ColorTheme */
