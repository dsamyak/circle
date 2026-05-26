/**
 * Calculate XP earned for an answer.
 * First try: 10 XP | Second try: 7 XP | With hint: 5 XP
 * Streak bonus: +5 XP when streak >= 5
 */
export function calcXP(attemptNumber, hintsUsed, streak) {
  const base = attemptNumber === 1 ? 10 : hintsUsed > 0 ? 5 : 7;
  const streakBonus = streak >= 5 ? 5 : 0;
  return base + streakBonus;
}

/**
 * Star rating for a world (10 questions each).
 * 9-10 correct → 3 stars | 7-8 → 2 stars | 6 → 1 star | <6 → 0
 */
export function calcStars(correct, total = 10) {
  if (correct >= 9) return 3;
  if (correct >= 7) return 2;
  if (correct >= 6) return 1;
  return 0;
}

/**
 * A world unlocks when the previous world scored >= 6/10.
 */
export function canUnlockNextWorld(worldScore) {
  return worldScore !== null && worldScore >= 6;
}
