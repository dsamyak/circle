/**
 * Badge definitions and unlock logic.
 * Each badge has an ID, display label, description, and a condition
 * function that checks against the current game state.
 */
export const BADGES = [
  {
    id: 'circle_spotter',
    label: '🔵 Circle Spotter',
    description: 'Complete Wonder & Story phases',
    condition: (s) => s.phaseComplete.wonder && s.phaseComplete.story,
  },
  {
    id: 'shape_sorter',
    label: '🏅 Shape Sorter',
    description: 'Complete all 3 simulation stations',
    condition: (s) => s.simStationsComplete.every(Boolean),
  },
  {
    id: 'circle_champion',
    label: '🥈 Circle Champion',
    description: 'Score 70%+ on Play phase',
    condition: (s) => {
      const total = s.worldScores.reduce((sum, ws) => sum + (ws || 0), 0);
      return total >= 70;
    },
  },
  {
    id: 'shape_master',
    label: '🥇 Shape Master',
    description: 'Score 80%+ on Play phase',
    condition: (s) => {
      const total = s.worldScores.reduce((sum, ws) => sum + (ws || 0), 0);
      return total >= 80;
    },
  },
  {
    id: 'perfect_round',
    label: '💎 Perfect Round',
    description: 'Score 10/10 in any world',
    condition: (s) => s.worldScores.some(ws => ws === 10),
  },
  {
    id: 'streak_legend',
    label: '🔥 Streak Legend',
    description: 'Achieve a 10-answer streak',
    condition: (s) => s.maxStreak >= 10,
  },
  {
    id: 'full_explorer',
    label: '🌟 Full Explorer',
    description: 'Complete all 5 phases',
    condition: (s) => Object.values(s.phaseComplete).every(Boolean),
  },
  {
    id: 'circle_hunter',
    label: '⭐ Circle Hunter',
    description: 'Find all circles in Station C on first attempt',
    condition: (s) => s.spotCircleFirstAttempt === true,
  },
];

/**
 * Returns array of badge IDs that just became unlockable.
 */
export function checkBadges(state) {
  return BADGES
    .filter(b => !state.badges.includes(b.id) && b.condition(state))
    .map(b => b.id);
}
