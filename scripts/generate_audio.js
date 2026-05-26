/**
 * ElevenLabs Audio Pre-Generation Script
 * Generates .mp3 files for all scripted narration phrases and writes audioMap.js.
 *
 * Usage:
 *   1. Set VITE_ELEVENLABS_API_KEY in .env.local
 *   2. Run: node scripts/generate_audio.js
 *   3. Files saved to public/assets/audio/
 *   4. audioMap.js updated at src/utils/audioMap.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length) process.env[key.trim()] = vals.join('=').trim();
  });
}

const API_KEY = process.env.VITE_ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('ERROR: VITE_ELEVENLABS_API_KEY not found in .env.local');
  process.exit(1);
}

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const MODEL_ID = 'eleven_multilingual_v2';

const STYLE_SETTINGS = {
  statement:     { stability: 0.70, similarity_boost: 0.80, style: 0.30 },
  instruction:   { stability: 0.75, similarity_boost: 0.85, style: 0.25 },
  question:      { stability: 0.55, similarity_boost: 0.80, style: 0.50 },
  encouragement: { stability: 0.60, similarity_boost: 0.85, style: 0.55 },
  emphasis:      { stability: 0.80, similarity_boost: 0.85, style: 0.20 },
  thinking:      { stability: 0.60, similarity_boost: 0.80, style: 0.40 },
  celebration:   { stability: 0.50, similarity_boost: 0.90, style: 0.70 },
};

// All phrases from PRD §13.4
const phrases = [
  // WONDER
  { text: "Have you ever noticed? A coin is round. A clock is round. The sun is round! What shape do they all share?", style: "thinking" },
  { text: "Let's find out together!", style: "encouragement" },

  // STORY
  { text: "One sunny day, John and Mike went to the food court for lunch!", style: "statement" },
  { text: "The lady gave them noodles on a big round plate. Look! The plate is a circle!", style: "statement" },
  { text: "This coin is a circle too! said Mike, showing John his coin.", style: "statement" },
  { text: "Above them, a round fan spun slowly. Circle again! they both said.", style: "statement" },
  { text: "A circle has one curved side and zero corners. It is perfectly round!", style: "emphasis" },
  { text: "Can you name it? C. I. R. C. L. E. Circle!", style: "statement" },
  { text: "Great job! Now let's explore circles ourselves!", style: "encouragement" },

  // SIMULATE — Station A
  { text: "Trace the dotted circle with your finger! Keep it smooth and round!", style: "instruction" },
  { text: "You drew a perfect circle! Round and smooth — no corners at all!", style: "celebration" },
  { text: "Almost! A circle has no sharp turns. Try again — nice and smooth!", style: "instruction" },

  // SIMULATE — Station B
  { text: "Sort the shapes! Does it belong in the Circle bin or the Not a Circle bin?", style: "question" },
  { text: "That's right! A circle is perfectly round with no corners!", style: "celebration" },
  { text: "Look carefully — does this shape have corners? Circles have none!", style: "emphasis" },
  { text: "Is an oval a circle? No! An oval is stretched out. A circle is perfectly round.", style: "emphasis" },

  // SIMULATE — Station C
  { text: "Find all the circles hiding in this picture! Tap each one you see!", style: "instruction" },
  { text: "You found a circle! Great spotting!", style: "celebration" },
  { text: "That one has corners! Look for the perfectly round shapes!", style: "instruction" },
  { text: "Amazing! You found all the circles! You are a Circle Champion!", style: "celebration" },

  // REFLECT
  { text: "Wow — you explored circles today! Can you name three circles you see at home?", style: "question" },
  { text: "Lesson complete! You are a true Circle Explorer! Well done!", style: "celebration" },

  // FEEDBACK — CORRECT
  { text: "Fantastic! That's a circle!", style: "celebration" },
  { text: "Brilliant! You got it!", style: "celebration" },
  { text: "Amazing! Circles have no corners and you know it!", style: "celebration" },
  { text: "Well done! Keep going!", style: "celebration" },

  // FEEDBACK — INCORRECT
  { text: "Let's look again! Remember — circles have no corners.", style: "instruction" },
  { text: "Almost! Check if the shape is perfectly round.", style: "instruction" },
  { text: "Not quite! A circle has one curved side and zero corners.", style: "emphasis" },

  // HINTS
  { text: "Hint! A circle is perfectly round — no corners, no flat sides.", style: "emphasis" },
  { text: "Hint! Count the corners. Circles have zero corners!", style: "emphasis" },
];

const AUDIO_DIR = path.join(__dirname, '..', 'public', 'assets', 'audio');
const AUDIO_MAP_PATH = path.join(__dirname, '..', 'src', 'utils', 'audioMap.js');

function sanitizeFilename(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 50);
}

async function generateAudio(phrase, index) {
  const filename = `audio_${sanitizeFilename(phrase.text)}_${index}.mp3`;
  const filepath = path.join(AUDIO_DIR, filename);

  // Skip if file already exists
  if (fs.existsSync(filepath)) {
    console.log(`[SKIP] ${filename} (already exists)`);
    return { text: phrase.text, path: `/assets/audio/${filename}` };
  }

  const settings = STYLE_SETTINGS[phrase.style] || STYLE_SETTINGS.statement;

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: phrase.text,
        model_id: MODEL_ID,
        voice_settings: settings,
      }),
    }
  );

  if (!response.ok) {
    console.error(`[ERROR] Failed for "${phrase.text.slice(0, 40)}...": ${response.status}`);
    return null;
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(filepath, buffer);
  console.log(`[OK] ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
  
  // Rate limit: wait 500ms between requests
  await new Promise(r => setTimeout(r, 500));

  return { text: phrase.text, path: `/assets/audio/${filename}` };
}

async function main() {
  console.log('🎤 ElevenLabs Audio Generation Script');
  console.log(`Voice: Alice (${VOICE_ID})`);
  console.log(`Model: ${MODEL_ID}`);
  console.log(`Total phrases: ${phrases.length}`);
  console.log('');

  // Ensure output directory exists
  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  const audioMap = {};

  for (let i = 0; i < phrases.length; i++) {
    const result = await generateAudio(phrases[i], i);
    if (result) {
      audioMap[result.text] = result.path;
    }
  }

  // Write audioMap.js
  const mapContent = `/**
 * AUTO-GENERATED by scripts/generate_audio.js
 * Do NOT edit by hand — re-run generate_audio.js to update.
 * Generated: ${new Date().toISOString()}
 */
const audioMap = ${JSON.stringify(audioMap, null, 2)};

export default audioMap;
`;
  fs.writeFileSync(AUDIO_MAP_PATH, mapContent);
  console.log('');
  console.log(`✅ audioMap.js updated with ${Object.keys(audioMap).length} entries`);
  console.log('Done!');
}

main().catch(console.error);
