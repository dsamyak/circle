/**
 * Narration segment definitions for all phases.
 * Semantic helpers wrap text into { text, style } objects.
 * CRITICAL: Every text here MUST match the on-screen UI text exactly.
 */

const say       = (t) => ({ text: t, style: 'statement' });
const ask       = (t) => ({ text: t, style: 'question' });
const cheer     = (t) => ({ text: t, style: 'celebration' });
const emphasize = (t) => ({ text: t, style: 'emphasis' });
const think     = (t) => ({ text: t, style: 'thinking' });
const celebrate = (t) => ({ text: t, style: 'celebration' });
const instruct  = (t) => ({ text: t, style: 'instruction' });
const encourage = (t) => ({ text: t, style: 'encouragement' });

export { say, ask, cheer, emphasize, think, celebrate, instruct, encourage };

// ── WONDER PHASE ──
export function wonderNarration() {
  return [
    think("Have you ever noticed? A coin is round. A clock is round. The sun is round! What shape do they all share?"),
    encourage("Let's find out together!"),
  ];
}

// ── STORY PHASE (per panel index) ──
export function storyNarration(panelIndex) {
  const panels = [
    [say("One sunny day, John and Mike went to the food court for lunch!")],
    [say("The lady gave them noodles on a big round plate. Look! The plate is a circle!")],
    [say("This coin is a circle too! said Mike, showing John his coin.")],
    [say("Above them, a round fan spun slowly. Circle again! they both said.")],
    [emphasize("A circle has one curved side and zero corners. It is perfectly round!")],
    [say("Can you name it? C. I. R. C. L. E. Circle!"), encourage("Great job! Now let's explore circles ourselves!")],
  ];
  return panels[panelIndex] || [];
}

// ── SIMULATE PHASE — Station A (Draw Circle) ──
export function simulateNarrationA() {
  return [instruct("Trace the dotted circle with your finger! Keep it smooth and round!")];
}
export function drawSuccessNarration() {
  return [celebrate("You drew a perfect circle! Round and smooth — no corners at all!")];
}
export function drawRetryNarration() {
  return [instruct("Almost! A circle has no sharp turns. Try again — nice and smooth!")];
}

// ── SIMULATE PHASE — Station B (Shape Sorter) ──
export function simulateNarrationB() {
  return [ask("Sort the shapes! Does it belong in the Circle bin or the Not a Circle bin?")];
}
export function sorterCorrectNarration() {
  return [celebrate("That's right! A circle is perfectly round with no corners!")];
}
export function sorterWrongNarration() {
  return [emphasize("Look carefully — does this shape have corners? Circles have none!")];
}
export function ovalNotCircleNarration() {
  return [emphasize("Is an oval a circle? No! An oval is stretched out. A circle is perfectly round.")];
}

// ── SIMULATE PHASE — Station C (Spot Circle) ──
export function simulateNarrationC() {
  return [instruct("Find all the circles hiding in this picture! Tap each one you see!")];
}
export function spotFoundNarration(label) {
  return [celebrate(`You found the ${label}! Great spotting!`)];
}
export function spotWrongNarration() {
  return [instruct("That one has corners! Look for the perfectly round shapes!")];
}
export function spotCompleteNarration() {
  return [celebrate("Amazing! You found all the circles! You are a Circle Champion!")];
}

// ── REFLECT PHASE ──
export function reflectNarration() {
  return [
    ask("Wow — you explored circles today! Can you name three circles you see at home?"),
  ];
}
export function lessonCompleteNarration() {
  return [celebrate("Lesson complete! You are a true Circle Explorer! Well done!")];
}

// ── FEEDBACK (correct / incorrect) ──
export const PRAISE_VARIANTS = [
  cheer("Fantastic! That's a circle!"),
  cheer("Brilliant! You got it!"),
  cheer("Amazing! Circles have no corners and you know it!"),
  cheer("Well done! Keep going!"),
];

export const WRONG_VARIANTS = [
  instruct("Let's look again! Remember — circles have no corners."),
  instruct("Almost! Check if the shape is perfectly round."),
  emphasize("Not quite! A circle has one curved side and zero corners."),
];

export const HINT_VARIANTS = [
  emphasize("Hint! A circle is perfectly round — no corners, no flat sides."),
  emphasize("Hint! Count the corners. Circles have zero corners!"),
];
