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
    [say("One bright morning, John and Sarah set off on a secret mission to the bustling food court! Their target? The most perfect shape in the universe!")],
    [say("The friendly cook handed them a mountain of noodles on a giant, gleaming plate. Look! gasped John. The plate has no corners... it's a circle!")],
    [say("Wait, look at my lucky gold coin! Sarah cheered, holding it up to the light. It's perfectly round, just like your plate. Another circle!")],
    [say("Suddenly, a cool breeze blew over them. They looked up to see a giant ceiling fan spinning super fast. Woosh! The spinning blades make a giant circle! they shouted together.")],
    [emphasize("They discovered the secret: A circle is a continuous, curved line with ZERO sharp corners! It is perfectly smooth and round.")],
    [say("Can you spell the magical shape they found? C. I. R. C. L. E. Circle!"), encourage("Great job! Now let's explore circles ourselves!")],
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

// ── SIMULATE PHASE — Wrapper ──
export function simulateNarration(index) {
  if (index === 0) return simulateNarrationA();
  if (index === 1) return simulateNarrationB();
  if (index === 2) return simulateNarrationC();
  return [];
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
