"use strict";

// Shared special-ability helpers used by the converters. Kept in one place so
// the position-gating logic has a single source of truth.

/**
 * Return true if the player (registered position or any of their additional
 * positions) is allowed to hold a special ability gated to `abilityPositions`.
 *
 * @param abilityPositions - Positions allowed to hold the ability.
 * @param registeredPosition - Player's primary position.
 * @param positions - Player's additional positions.
 * @returns True if the player qualifies by position.
 */
function hasSpecialAbility(abilityPositions, registeredPosition, positions) {
  if (abilityPositions.includes(registeredPosition)) return true;
  for (let index = 0; index < positions.length; index++) {
    let position = positions[index];
    if (abilityPositions.includes(position)) return true;
  }
  return false;
}
