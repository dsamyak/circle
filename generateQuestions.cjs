const fs = require('fs');

const THEMES = [
  "A space alien looking for UFO parts",
  "A wizard brewing a round potion",
  "A dinosaur searching for round eggs",
  "A robot building a circular wheel",
  "A pirate hunting for perfectly round gold coins",
  "An astronaut looking at planets",
  "A superhero needing a round shield",
  "A racecar driver checking round tires"
];

function getRandomTheme() {
  return THEMES[Math.floor(Math.random() * THEMES.length)];
}

const bank = [];

// 1. yes_no (15)
for (let i=1; i<=15; i++) {
  const isCircle = Math.random() > 0.5;
  const shape = isCircle ? "circle" : ["square", "triangle", "rectangle", "oval", "semicircle"][Math.floor(Math.random() * 5)];
  
  const text = isCircle 
    ? `The wizard found this shape. Is it a perfect circle?`
    : `The robot found a ${shape}. Is this shape a circle?`;

  bank.push({
    id: `Q1_${i}`, type: "yes_no", world: Math.floor((i-1)/1.5), difficulty: 1 + Math.floor(i/5),
    questionText: text,
    visual: "single_shape", targetShape: shape, isCircle,
    options: ["Yes", "No"],
    correctAnswer: isCircle ? "Yes" : "No",
    hint1: "Circles are perfectly round with no corners.",
    hint2: isCircle ? "It has no corners!" : "Look at the corners or stretched sides!",
    explanation: isCircle ? "Yes! It is perfectly round." : `No! That is a ${shape}.`
  });
}

// 2. name_shape (15)
for (let i=1; i<=15; i++) {
  const shapes = ["circle", "square", "triangle", "rectangle", "oval", "semicircle"];
  const target = shapes[Math.floor(Math.random() * shapes.length)];
  const options = [target];
  while(options.length < 4) {
    const r = shapes[Math.floor(Math.random() * shapes.length)];
    if(!options.includes(r)) options.push(r);
  }
  options.sort(() => Math.random() - 0.5);

  bank.push({
    id: `Q2_${i}`, type: "name_shape", world: Math.floor((i-1)/1.5), difficulty: 1 + Math.floor(i/5),
    questionText: `The pirate needs to name this shape to unlock the chest. What is it?`,
    visual: "single_shape", targetShape: target,
    options: options.map(o => o.charAt(0).toUpperCase() + o.slice(1)),
    correctAnswer: target.charAt(0).toUpperCase() + target.slice(1),
    hint1: "Count the sides and corners.",
    hint2: target === 'circle' ? "It's perfectly round!" : "It's not a circle.",
    explanation: `It is a ${target}!`
  });
}

// 3. property (15)
const props = [
  { q: "How many corners does a circle have?", a: 0, o: [0,1,2,4], h: "Smooth and round!" },
  { q: "How many curved sides does a circle have?", a: 1, o: [0,1,2,4], h: "One continuous loop!" },
  { q: "Which shape has ZERO corners?", a: "Circle", o: ["Circle","Square","Triangle","Rectangle"], h: "Only one is perfectly round." }
];
for (let i=1; i<=15; i++) {
  const p = props[Math.floor(Math.random() * props.length)];
  const opts = [...p.o].sort(() => Math.random() - 0.5);
  bank.push({
    id: `Q3_${i}`, type: "property", world: Math.floor((i-1)/1.5), difficulty: 1 + Math.floor(i/5),
    questionText: `The space alien asks: ${p.q}`,
    visual: p.a === "Circle" ? "shapes_mcq" : "single_shape", targetShape: "circle",
    options: opts, correctAnswer: p.a,
    hint1: p.h, hint2: "Think about perfectly round shapes.",
    explanation: `The answer is ${p.a}. Circles have 1 curved side and 0 corners.`
  });
}

// 4. pick_circle (15)
for (let i=1; i<=15; i++) {
  const shapes = ["circle", "square", "triangle", "rectangle", "oval", "semicircle"];
  const options = ["circle"];
  while(options.length < 4) {
    const r = shapes[Math.floor(Math.random() * shapes.length)];
    if(r !== "circle" && !options.includes(r)) options.push(r);
  }
  options.sort(() => Math.random() - 0.5);

  bank.push({
    id: `Q4_${i}`, type: "pick_circle", world: Math.floor((i-1)/1.5), difficulty: 1 + Math.floor(i/5),
    questionText: `Help the astronaut find the planet! Which shape is a circle?`,
    visual: "shapes_mcq", options: options, correctAnswer: "circle",
    hint1: "Look for the perfectly round one.", hint2: "No corners!",
    explanation: "The circle is perfectly round!"
  });
}

// 5. real_world (15)
const realObjects = [
  { name: "🪙 Gold Coin", isC: true },
  { name: "🍕 Pizza Slice", isC: false },
  { name: "⌚ Clock Face", isC: true },
  { name: "📺 TV Screen", isC: false },
  { name: "🌕 Full Moon", isC: true },
  { name: "🚪 Door", isC: false },
  { name: "🍩 Donut", isC: true },
  { name: "📏 Ruler", isC: false },
  { name: "🛞 Wheel", isC: true },
  { name: "📕 Book", isC: false }
];
for (let i=1; i<=15; i++) {
  const isFindCircle = Math.random() > 0.5;
  const correctObj = realObjects.find(o => o.isC === isFindCircle);
  
  const options = [correctObj.name];
  const shuffledOthers = realObjects.filter(o => o.isC !== isFindCircle).sort(() => Math.random() - 0.5);
  options.push(shuffledOthers[0].name, shuffledOthers[1].name, shuffledOthers[2].name);
  options.sort(() => Math.random() - 0.5);

  bank.push({
    id: `Q5_${i}`, type: "real_world", world: Math.floor((i-1)/1.5), difficulty: 1 + Math.floor(i/5),
    questionText: `The detective is searching! Which object is ${isFindCircle ? "shaped like a circle" : "NOT a circle"}?`,
    visual: "real_objects", options: options, correctAnswer: correctObj.name,
    hint1: "Think about the shape in real life.", hint2: isFindCircle ? "Look for perfectly round objects." : "Look for corners.",
    explanation: `${correctObj.name} is ${isFindCircle ? "round!" : "not round!"}`
  });
}

// 6. count_circles (15)
for (let i=1; i<=15; i++) {
  const shapes = [];
  const numShapes = 4 + Math.floor(Math.random() * 3); // 4 to 6
  let circlesCount = 0;
  for(let j=0; j<numShapes; j++) {
    const isC = Math.random() > 0.5;
    if (isC) { shapes.push("circle"); circlesCount++; }
    else shapes.push(["square", "triangle", "oval", "rectangle", "semicircle"][Math.floor(Math.random() * 5)]);
  }
  
  let options = [circlesCount];
  while(options.length < 4) {
    const r = Math.floor(Math.random() * 8);
    if(!options.includes(r)) options.push(r);
  }
  options.sort((a,b) => a - b);

  bank.push({
    id: `Q6_${i}`, type: "count_circles", world: Math.floor((i-1)/1.5), difficulty: 1 + Math.floor(i/5),
    questionText: `The dinosaur is hungry! How many perfect circles can it eat?`,
    visual: "shape_group", shapes: shapes, options: options, correctAnswer: circlesCount,
    hint1: "Count ONLY the perfectly round shapes.", hint2: "Ovals and semi-circles do not count!",
    explanation: `There are ${circlesCount} circles!`
  });
}

// 7. true_false (15)
const tfFacts = [
  { q: "A circle has 4 corners.", a: "False" },
  { q: "A circle is perfectly round.", a: "True" },
  { q: "An oval is the exact same as a circle.", a: "False" },
  { q: "A circle has 1 continuous curved side.", a: "True" },
  { q: "A square has no corners.", a: "False" }
];
for (let i=1; i<=15; i++) {
  const fact = tfFacts[Math.floor(Math.random() * tfFacts.length)];
  bank.push({
    id: `Q7_${i}`, type: "true_false", world: Math.floor((i-1)/1.5), difficulty: 1 + Math.floor(i/5),
    questionText: `The wizard says: "${fact.q}" Is this True or False?`,
    visual: "true_false", options: ["True", "False"], correctAnswer: fact.a,
    hint1: "Think carefully!", hint2: fact.a === "True" ? "It is a fact!" : "It's a trick!",
    explanation: `The statement is ${fact.a}!`
  });
}

// 8. odd_one_out (15)
for (let i=1; i<=15; i++) {
  const isCircleOdd = Math.random() > 0.5;
  const options = [];
  let correct = "";
  if (isCircleOdd) {
    const other = ["square", "triangle", "rectangle"][Math.floor(Math.random() * 3)];
    options.push(other, other, other, "circle");
    correct = "circle";
  } else {
    const other = ["square", "triangle", "rectangle", "oval", "semicircle"][Math.floor(Math.random() * 5)];
    options.push("circle", "circle", "circle", other);
    correct = other;
  }
  options.sort(() => Math.random() - 0.5);

  bank.push({
    id: `Q8_${i}`, type: "odd_one_out", world: Math.floor((i-1)/1.5), difficulty: 1 + Math.floor(i/5),
    questionText: `The robot's scanner detected an odd shape! Which one doesn't belong?`,
    visual: "shapes_mcq", options: options, correctAnswer: correct,
    hint1: "Three shapes are the same kind.", hint2: "Find the one that is different.",
    explanation: `The ${correct} is the odd one out!`
  });
}

// 9. pattern (15)
for (let i=1; i<=15; i++) {
  const s1 = "circle";
  const s2 = ["square", "triangle", "rectangle"][Math.floor(Math.random() * 3)];
  const seq = [s1, s2, s1, s2, s1];
  const next = s2;
  const options = [s1, s2, "triangle", "oval"].filter((v,i,a)=>a.indexOf(v)===i);
  while(options.length < 4) options.push("square"); // fallback

  bank.push({
    id: `Q9_${i}`, type: "pattern", world: Math.floor((i-1)/1.5), difficulty: 1 + Math.floor(i/5),
    questionText: `Decode the alien's message! What shape comes next?`,
    visual: "pattern_row", patternSequence: seq, options: options, correctAnswer: next,
    hint1: "Look at how it repeats.", hint2: `It goes ${s1}, ${s2}...`,
    explanation: `The next shape is ${next}!`
  });
}

// 10. word_problem (15)
const wpTemplates = [
  "Captain Alex found a treasure map. The mark is a shape with NO corners. What shape is it?",
  "Superhero Mia has a shield that is perfectly round. What shape is her shield?",
  "Astronaut Ryan sees a planet with 1 curved side. What shape is it?",
  "Wizard Lily baked a magical cookie that is perfectly round. What shape is it?"
];
for (let i=1; i<=15; i++) {
  const wp = wpTemplates[Math.floor(Math.random() * wpTemplates.length)];
  const options = ["Circle", "Square", "Triangle", "Rectangle"].sort(() => Math.random() - 0.5);
  bank.push({
    id: `Q10_${i}`, type: "word_problem", world: Math.floor((i-1)/1.5), difficulty: 1 + Math.floor(i/5),
    questionText: wp,
    visual: "text_mcq", options: options, correctAnswer: "Circle",
    hint1: "Think about the properties mentioned.", hint2: "Perfectly round means...",
    explanation: "It's a Circle!"
  });
}

const fileContent = "/**\n * Complete Question Bank - Expanded for variety\n */\nconst questionBank = " + JSON.stringify(bank, null, 2) + ";\nexport default questionBank;\n";

fs.writeFileSync('src/data/questionBank.js', fileContent);
console.log('Successfully generated expanded question bank with 150 questions.');
