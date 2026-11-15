// Cinderfall's handover program (Node 22, standard library only). The game itself is the
// game/ folder beside this file — plain static files the browser loads as ES modules, with
// three.js 0.187.0 vendored inside it. This program's whole job is to hand that game in:
// copy game/ and screenshots/ into the output directory and write dossier.json there with
// the kit's own library (vendor/makefun-threejs.ts, unchanged), so the dossier the judge
// reads is byte for byte the one the library builds from these files.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-threejs.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The caps are the scorer's own (the gate refuses more than 4 screenshots or one over
// 256 KiB, more than 993 files or 48 MiB under game/): text_max_bytes is the dossier's
// source-text cap, the rest make this program refuse what the scorer would refuse.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
  }),
);
