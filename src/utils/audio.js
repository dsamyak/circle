/**
 * ElevenLabs Audio Engine
 * Pipeline: audioMap (static) → memory cache → dynamic API → silent skip
 * No browser Web Speech API fallback — ever.
 */
import audioMap from './audioMap.js';

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

// In-memory cache for dynamically generated audio URLs
const elevenLabsCache = {};

// Currently playing audio element (for stopping)
let currentAudio = null;

/**
 * Get an audio URL for the given text.
 * 1. Check static audioMap
 * 2. Check in-memory cache
 * 3. Dynamic ElevenLabs API call
 * 4. Return null (silent skip)
 */
export async function getAudioUrl(text, style = 'statement') {
  // 1. Static map
  if (audioMap[text]) {
    return audioMap[text];
  }

  // 2. Memory cache
  if (elevenLabsCache[text]) {
    return elevenLabsCache[text];
  }

  // 3. Dynamic generation
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: MODEL_ID,
          voice_settings: STYLE_SETTINGS[style] || STYLE_SETTINGS.statement,
        }),
      }
    );

    if (!response.ok) return null;

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    elevenLabsCache[text] = url;
    return url;
  } catch {
    return null;
  }
}

/**
 * Speak a single text segment. Returns a promise that resolves when done.
 */
export function speak(text, style = 'statement') {
  return new Promise(async (resolve) => {
    const url = await getAudioUrl(text, style);
    if (!url) { resolve(); return; }

    try {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      currentAudio = new Audio(url);
      currentAudio.onended = () => { currentAudio = null; resolve(); };
      currentAudio.onerror = () => { currentAudio = null; resolve(); };
      await currentAudio.play();
    } catch {
      resolve();
    }
  });
}

/**
 * Stop currently playing audio.
 */
export function stopAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

/**
 * Play an array of narration segments sequentially.
 * Eagerly preloads the next segment while the current one plays.
 */
export async function narrate(segments, audioEnabled = true) {
  if (!audioEnabled || !segments || segments.length === 0) return;

  for (let i = 0; i < segments.length; i++) {
    // Preload next segment
    if (i + 1 < segments.length) {
      getAudioUrl(segments[i + 1].text, segments[i + 1].style);
    }
    await speak(segments[i].text, segments[i].style);
  }
}

/**
 * Preload narration segments (non-blocking).
 */
export function preloadNarration(segments) {
  if (!segments) return;
  segments.forEach(seg => getAudioUrl(seg.text, seg.style));
}
