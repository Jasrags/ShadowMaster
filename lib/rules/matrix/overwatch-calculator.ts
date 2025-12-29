/**
 * Overwatch Score Calculator
 *
 * Calculates Overwatch Score increases and handles convergence.
 * In SR5, GOD (Grid Overwatch Division) tracks illegal matrix activity.
 * When OS reaches 40, convergence occurs - GOD dispatches IC and
 * attempts to crash the decker's persona.
 */

import type { Character } from "@/lib/types";
import type {
  MatrixState,
  MatrixAction,
  ConvergenceResult,
  ICSpawnData,
  MatrixMode,
} from "@/lib/types/matrix";
import { OVERWATCH_THRESHOLD } from "@/lib/types/matrix";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Result of an Overwatch Score calculation
 */
export interface OverwatchCalculationResult {
  previousScore: number;
  scoreAdded: number;
  newScore: number;
  convergenceTriggered: boolean;
  /** How close to convergence (0-100%) */
  convergenceProgress: number;
}

/**
 * Success level for matrix actions
 */
export type MatrixActionResult = "success" | "failure" | "glitch" | "critical_glitch";

// =============================================================================
// OVERWATCH SCORE CALCULATION
// =============================================================================

/**
 * Roll 2d6 for Overwatch Score increase
 *
 * In SR5, each illegal action adds 2d6 to the decker's OS.
 *
 * @returns Rolled value (2-12)
 */
export function rollOverwatchIncrease(): number {
  const die1 = Math.floor(Math.random() * 6) + 1;
  const die2 = Math.floor(Math.random() * 6) + 1;
  return die1 + die2;
}

/**
 * Calculate Overwatch Score increase for a matrix action
 *
 * Only illegal actions increase OS. Success or failure doesn't matter -
 * just attempting an illegal action draws GOD's attention.
 *
 * @param action - The matrix action being performed
 * @param actionResult - Result of the action (affects glitch handling)
 * @param currentOS - Current Overwatch Score
 * @returns Calculation result including new score
 */
export function calculateOverwatchIncrease(
  action: MatrixAction,
  actionResult: MatrixActionResult,
  currentOS: number
): OverwatchCalculationResult {
  // Legal actions don't increase OS
  if (action.legality === "legal") {
    return {
      previousScore: currentOS,
      scoreAdded: 0,
      newScore: currentOS,
      convergenceTriggered: false,
      convergenceProgress: (currentOS / OVERWATCH_THRESHOLD) * 100,
    };
  }

  // Roll 2d6 for illegal action
  let scoreAdded = rollOverwatchIncrease();

  // Critical glitches add extra OS (GM discretion, +2d6 is common house rule)
  if (actionResult === "critical_glitch") {
    scoreAdded += rollOverwatchIncrease();
  }

  const newScore = currentOS + scoreAdded;
  const convergenceTriggered = newScore >= OVERWATCH_THRESHOLD;

  return {
    previousScore: currentOS,
    scoreAdded,
    newScore,
    convergenceTriggered,
    convergenceProgress: Math.min((newScore / OVERWATCH_THRESHOLD) * 100, 100),
  };
}

/**
 * Calculate OS increase with a fixed value (for testing or GM override)
 *
 * @param currentOS - Current Overwatch Score
 * @param scoreToAdd - Fixed score to add
 * @returns Calculation result
 */
export function addOverwatchScore(
  currentOS: number,
  scoreToAdd: number
): OverwatchCalculationResult {
  const newScore = currentOS + scoreToAdd;

  return {
    previousScore: currentOS,
    scoreAdded: scoreToAdd,
    newScore,
    convergenceTriggered: newScore >= OVERWATCH_THRESHOLD,
    convergenceProgress: Math.min((newScore / OVERWATCH_THRESHOLD) * 100, 100),
  };
}

// =============================================================================
// CONVERGENCE DETECTION
// =============================================================================

/**
 * Check if convergence threshold has been reached
 *
 * @param currentOS - Current Overwatch Score
 * @param threshold - Convergence threshold (default: 40)
 * @returns True if convergence should occur
 */
export function checkConvergence(
  currentOS: number,
  threshold: number = OVERWATCH_THRESHOLD
): boolean {
  return currentOS >= threshold;
}

/**
 * Get warning level based on current OS
 *
 * @param currentOS - Current Overwatch Score
 * @returns Warning level for UI display
 */
export function getOverwatchWarningLevel(
  currentOS: number
): "safe" | "caution" | "warning" | "danger" | "critical" {
  const percentage = (currentOS / OVERWATCH_THRESHOLD) * 100;

  if (percentage < 25) return "safe";
  if (percentage < 50) return "caution";
  if (percentage < 75) return "warning";
  if (percentage < 100) return "danger";
  return "critical";
}

// =============================================================================
// CONVERGENCE HANDLING
// =============================================================================

/**
 * Determine IC to dispatch based on host rating equivalent
 *
 * GOD typically dispatches IC based on the severity of the intrusion.
 * Higher OS at convergence = more dangerous IC.
 *
 * @param finalOS - OS score when convergence triggered
 * @returns Array of IC to spawn
 */
function determineDispatchedIC(finalOS: number): ICSpawnData[] {
  const icList: ICSpawnData[] = [];

  // Base IC - always dispatched
  icList.push({
    icType: "Patrol IC",
    rating: 4,
  });

  // Additional IC based on OS severity
  if (finalOS >= 50) {
    icList.push({
      icType: "Probe IC",
      rating: 5,
    });
  }

  if (finalOS >= 60) {
    icList.push({
      icType: "Track IC",
      rating: 5,
    });
  }

  if (finalOS >= 70) {
    icList.push({
      icType: "Black IC",
      rating: 6,
    });
  }

  return icList;
}

/**
 * Calculate dumpshock damage
 *
 * Dumpshock occurs when forcibly disconnected from VR.
 * - Cold-sim VR: Stun damage
 * - Hot-sim VR: Physical damage
 * - AR: No dumpshock
 *
 * @param connectionMode - Current connection mode
 * @param deviceRating - Rating of the device being used
 * @returns Damage amount and type
 */
export function calculateDumpshockDamage(
  connectionMode: MatrixMode,
  deviceRating: number
): { amount: number; type: "stun" | "physical" | null } {
  switch (connectionMode) {
    case "ar":
      // No dumpshock in AR
      return { amount: 0, type: null };

    case "cold-sim-vr":
      // Stun damage equal to device rating
      return { amount: deviceRating, type: "stun" };

    case "hot-sim-vr":
      // Physical damage equal to device rating
      return { amount: deviceRating, type: "physical" };
  }
}

/**
 * Handle convergence effects
 *
 * When GOD catches up with the decker:
 * 1. Persona is destroyed (forced disconnect)
 * 2. Dumpshock occurs if in VR
 * 3. IC is dispatched to the decker's last known location
 * 4. OS resets to 0
 *
 * @param character - The character experiencing convergence
 * @param matrixState - Current matrix state
 * @returns Convergence effects
 */
export function handleConvergence(
  character: Character,
  matrixState: MatrixState
): ConvergenceResult {
  // Calculate dumpshock based on connection mode
  const dumpshock = calculateDumpshockDamage(
    matrixState.connectionMode,
    matrixState.persona.deviceRating
  );

  // Determine what IC to dispatch
  const icDispatched = determineDispatchedIC(matrixState.overwatchScore);

  return {
    osReset: true,
    dumpshockTriggered: dumpshock.type !== null,
    personaDestroyed: true,
    icDispatched,
    damageDealt: dumpshock.amount > 0 ? dumpshock.amount : undefined,
    damageType: dumpshock.type ?? undefined,
  };
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Calculate time remaining before automatic OS increase
 *
 * In SR5, OS automatically increases by 2d6 every 15 minutes
 * (or per combat turn at GM discretion).
 *
 * @param sessionStartTime - When the matrix session started
 * @param currentTime - Current time
 * @returns Minutes until next automatic increase (0-15)
 */
export function calculateTimeUntilAutoIncrease(
  sessionStartTime: Date,
  currentTime: Date = new Date()
): number {
  const elapsedMs = currentTime.getTime() - sessionStartTime.getTime();
  const elapsedMinutes = Math.floor(elapsedMs / 60000);
  const minutesSinceLastIncrease = elapsedMinutes % 15;
  return 15 - minutesSinceLastIncrease;
}

/**
 * Check if it's time for an automatic OS increase
 *
 * @param sessionStartTime - When the matrix session started
 * @param lastAutoIncreaseTime - When the last auto increase occurred
 * @param currentTime - Current time
 * @returns True if 15 minutes have passed since last increase
 */
export function shouldAutoIncreaseOS(
  sessionStartTime: Date,
  lastAutoIncreaseTime: Date | null,
  currentTime: Date = new Date()
): boolean {
  const referenceTime = lastAutoIncreaseTime ?? sessionStartTime;
  const elapsedMs = currentTime.getTime() - referenceTime.getTime();
  const elapsedMinutes = elapsedMs / 60000;
  return elapsedMinutes >= 15;
}

/**
 * Get a human-readable description of the OS status
 *
 * @param currentOS - Current Overwatch Score
 * @returns Description string
 */
export function getOverwatchStatusDescription(currentOS: number): string {
  if (currentOS === 0) {
    return "Clean - No GOD attention";
  }
  if (currentOS < 10) {
    return "Low profile - Minor GOD interest";
  }
  if (currentOS < 20) {
    return "On the radar - GOD tracking initiated";
  }
  if (currentOS < 30) {
    return "Hot pursuit - GOD actively hunting";
  }
  if (currentOS < 40) {
    return "Critical - Convergence imminent!";
  }
  return "CONVERGED - GOD has found you!";
}
