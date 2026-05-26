/**
 * Fisher-Yates shuffle — produces a uniformly random permutation.
 */
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generate a session's 100 questions from the full bank.
 * Picks all questions, groups by type, shuffles within each type,
 * then does a final cross-type shuffle.
 */
export function generateSessionQuestions(bank) {
  const byType = {};
  bank.forEach(q => {
    if (!byType[q.type]) byType[q.type] = [];
    byType[q.type].push(q);
  });
  const selected = Object.values(byType)
    .flatMap(qs => shuffleArray(qs).slice(0, 10));
  return shuffleArray(selected);
}

/**
 * Shuffle MCQ options so correct answer isn't always first.
 */
export function shuffleOptions(options) {
  return shuffleArray(options);
}
