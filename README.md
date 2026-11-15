# Cinderfall — a three.js tactical FPS

A round-based tactical shooter for the browser, in the style Counter-Strike made famous —
built from scratch on three.js 0.187.0, with an original map, original names, and no assets
to download: every texture is painted in code, every sound is synthesized with WebAudio, and
the fighters and guns are built from boxes at runtime. It plays completely offline against
bots.

**Ember** attacks **the Wardens** across **Cinder Yard**, a dusk freight yard. Win a round by
eliminating the other team, or — as Ember — by planting the breach charge at the **Foundry
(Site A)** or the **Depot (Site B)** and holding it until it blows. Wardens win by running
the clock down or defusing. First to 9 rounds takes the match.

## Play it

```sh
node serve.ts            # serves game/ at http://localhost:8080
```

Open the page, click to play. Any static file server works just as well — `game/` is plain
files, ES modules, no build step.

| Input | Action |
| --- | --- |
| WASD / mouse | move / look |
| Click / right-click | fire / aim (the Longbow gets a scope) |
| Shift | walk — slow and quiet |
| Ctrl or C | crouch |
| Space | jump |
| R / Q | reload / last weapon |
| 1, 2 | primary, sidearm |
| 4, 5, 6 | Shard frag, Lumen flash, Veil smoke — click to throw |
| B | buy menu (during the buy phase) |
| E (hold) | plant the charge on a site |

## The game

- **Gunplay that rewards stopping.** Spread is several times tighter standing still than
  running, crouching tightens it further, and jumping is hopeless — the crosshair shows the
  true spread, so the HUD teaches the mechanic. Headshots multiply damage (up to ×3.9),
  armour blunts body shots, and damage falls off past each weapon's range.
- **Five weapons, three grenades, one economy.** The P9 Sparrow sidearm, Raptor-9 SMG,
  Mule 12 scattergun, VK-7 Kestrel rifle and Longbow .338; frag, flash (it blinds by facing
  and line of sight) and smoke (it genuinely blocks vision — the bots can't see through it
  either). Kills, plants and round results pay into a persistent team economy with a buy
  phase every round.
- **Bots with a plan.** Nine bot fighters run the same physics and weapon code as the
  player. Defenders split across both sites and mid, each post watching its lane; attackers
  commit to a site each round, trade through waypoint routes, react to gunfire they hear,
  fall back for a dropped charge, plant it, defend the plant — and the Wardens rotate in to
  defuse, even after every attacker is down, exactly as the rules demand.
- **A fixed-step simulation.** The match ticks at 60 Hz regardless of display rate, in
  modules with one job each: `state` (the match), `world` (the map as data), `physics`
  (bodies and ray tests), `weapons`, `bots`, `player`, `hud`, `effects`, `audio`, `models`,
  `nav`. State lives in one place; hot loops allocate nothing.

## Handing it in

`main.ts` is the make.fun handover program: it copies `game/` and `screenshots/` to the
output directory and writes `dossier.json` there with the kit's vendored library
(`vendor/makefun-threejs.ts`, byte for byte the kit's copy).

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Screenshots are real captures of the staged scenes the game itself defines
(`game/src/shots.js`, `?shot=cover|buy|combat|plant`), taken in a headless browser —
never edited or composited.

## License

MIT — see `LICENSE`. three.js is vendored under `game/vendor/three/` under its own MIT
license (`game/vendor/three/LICENSE`).
