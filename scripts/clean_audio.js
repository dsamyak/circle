/**
 * Audio Cleanup Script
 * Removes .mp3 files from public/assets/audio/ that are not referenced in audioMap.js.
 *
 * Usage: node scripts/clean_audio.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUDIO_DIR = path.join(__dirname, '..', 'public', 'assets', 'audio');
const AUDIO_MAP_PATH = path.join(__dirname, '..', 'src', 'utils', 'audioMap.js');

async function main() {
  console.log('🧹 Audio Cleanup Script');

  if (!fs.existsSync(AUDIO_DIR)) {
    console.log('No audio directory found. Nothing to clean.');
    return;
  }

  // Dynamically import audioMap
  const { default: audioMap } = await import(AUDIO_MAP_PATH);
  const validPaths = new Set(Object.values(audioMap).map(p => path.basename(p)));

  const files = fs.readdirSync(AUDIO_DIR).filter(f => f.endsWith('.mp3'));
  let removed = 0;

  for (const file of files) {
    if (!validPaths.has(file)) {
      fs.unlinkSync(path.join(AUDIO_DIR, file));
      console.log(`[REMOVED] ${file}`);
      removed++;
    }
  }

  console.log(`\n✅ Cleaned ${removed} orphaned files. ${files.length - removed} files kept.`);
}

main().catch(console.error);
