"use strict";

// Position parsing and mapping between source games (FM/FIFA/eFootball) and the
// PES editions. Each map is a distinct contract (PES5, PES13, and PES21 use
// different position codes), so they intentionally live side by side here.

/**
 * Map a Football Manager position code to its old-gen PES (5/13) equivalent.
 *
 * @param position - FM position code (e.g. "DC", "AMC").
 * @returns PES position code.
 */
function FMToPESPositions(position) {
  switch (position) {
    case "GK":
      return "GK";
    case "DC":
      return "CBT";
    case "DL":
    case "DR":
      return "SB";
    case "DM":
      return "DMF";
    case "WBL":
    case "WBR":
      return "WB";
    case "MC":
      return "CMF";
    case "ML":
    case "MR":
      return "SMF";
    case "AMC":
      return "AMF";
    case "AML":
    case "AMR":
      return "WF";
    // There's no equivalent of SS on FM
    case "ST":
      return "CF";
    default:
      return position;
  }
}

/**
 * Split a comma-separated position string into a trimmed array.
 *
 * @param positions - e.g. "AML, AMR, ST".
 * @returns Array of position codes.
 */
function FMPositionStringToArray(positions) {
  const trimmedString = positions.replace(/,\s*/g, ",");
  return trimmedString.split(",");
}

/**
 * Determine the player's favoured side ("B", "L", or "R") from their position
 * list.
 *
 * @param positions - Array of position codes.
 * @param useLastChar - True to inspect the last char (FM codes) instead of the
 *   first char (FIFA/eFootball codes).
 * @returns "B", "L", or "R".
 */
function GetFavSide(positions, useLastChar) {
  let favSide = "B";
  let bothSides = 0;
  let leftSide = 0;
  let rightSide = 0;

  for (let index = 0; index < positions.length; index++) {
    if (useLastChar) {
      if (positions[index].slice(-1) === "L") {
        leftSide++;
      } else if (positions[index].slice(-1) === "R") {
        rightSide++;
      } else {
        bothSides++;
      }
    } else {
      if (positions[index][0] === "L") {
        leftSide++;
      } else if (positions[index][0] === "R") {
        rightSide++;
      } else {
        bothSides++;
      }
    }
  }

  if (bothSides > leftSide && bothSides > rightSide) {
    favSide = "B";
  } else if (leftSide > bothSides && leftSide > rightSide) {
    favSide = "L";
  } else if (rightSide > bothSides && rightSide > leftSide) {
    favSide = "R";
  }

  return favSide;
}

/**
 * Map an eFootball position code to its old-gen PES (5/13) equivalent.
 *
 * @param position - eFootball position code.
 * @returns PES position code.
 */
function EfootballToPESPosition(position) {
  switch (position) {
    case "CB":
      return "CBT";
    case "RB":
    case "LB":
      return "SB";
    case "RMF":
    case "LMF":
      return "SMF";
    case "RWF":
    case "LWF":
      return "WF";
    default:
      return position;
  }
}

/**
 * Map a Football Manager position code to its PES21/20 equivalent.
 *
 * @param position - FM position code.
 * @returns PES21 position code.
 */
function FMToPES21Positions(position) {
  switch (position) {
    case "GK":
      return "GK";
    case "DC":
      return "CB";
    case "DL":
      return "LB";
    case "DR":
      return "RB";
    case "DM":
      return "DMF";
    case "WBL":
      return "LB";
    case "WBR":
      return "RB";
    case "MC":
      return "CMF";
    case "ML":
      return "LMF";
    case "MR":
      return "RMF";
    case "AMC":
      return "AMF";
    case "AML":
      return "LWF";
    case "AMR":
      return "RWF";
    case "ST":
      return "CF";
    default:
      return position;
  }
}

/**
 * Map a FIFA position code to its PES21/20 equivalent.
 *
 * @param position - FIFA position code.
 * @returns PES21 position code.
 */
function FIFAToPES21Positions(position) {
  switch (position) {
    case "GK":
      return "GK";
    case "CB":
      return "CB";
    case "LB":
    case "LWB":
      return "LB";
    case "RB":
    case "RWB":
      return "RB";
    case "CDM":
      return "DMF";
    case "CM":
      return "CMF";
    case "LM":
      return "LMF";
    case "RM":
      return "RMF";
    case "CAM":
      return "AMF";
    case "LW":
      return "LWF";
    case "RW":
      return "RWF";
    case "LF":
    case "RF":
    case "CF":
    case "LS":
    case "RS":
      return "SS";
    case "ST":
      return "CF";
    default:
      return position;
  }
}
