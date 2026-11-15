// shots.js — the staged frames the screenshots are taken from. Each scene arranges a real
// moment of the game (the same state the simulation plays in, posed) so a headless browser
// can capture it deterministically: ?shot=cover|buy|combat|plant&seed=N. Nothing here is a
// mock-up screen — it is the live game, frozen mid-breath.

import { state, giveWeapon } from './state.js';
import { switchTo } from './weapons.js';
import { setBuyOpen, hideBanner } from './hud.js';

function stage(f, x, z, yaw) {
  f.x = x; f.z = z; f.y = 0; f.yaw = yaw; f.pitch = 0;
  f.vx = f.vy = f.vz = 0;
  if (f.bot) { f.bot.path = []; f.bot.pathI = 0; }
}

function botsOf(team) {
  return state.fighters.filter((f) => f.team === team && !f.isPlayer);
}

function kitPlayer(weapon, money) {
  const p = state.player;
  if (weapon) { giveWeapon(p, weapon); switchTo(p, 'primary'); }
  p.inv.armor = true;
  if (money !== undefined) p.money = money;
  return p;
}

// Returns how the capture should run: sim steps to settle, and steps on which the player fires.
export function setupShot(name) {
  const p = state.player;
  hideBanner();
  if (name === 'buy') {
    p.money = 5400;
    state.phaseT = 9.4;
    stage(p, -27, 27, -0.85);
    setBuyOpen(true); // re-render the menu at the staged balance
    return { steps: 2, fireAt: [] };
  }
  setBuyOpen(false);
  state.phase = 'live';

  if (name === 'cover') {
    state.phaseT = 84;
    kitPlayer('kestrel');
    stage(p, -1.0, 15.0, -0.62);
    const embers = botsOf('ember');
    stage(embers[0], 3.2, 9.5, -0.85);
    stage(embers[1], 5.6, 13.8, -0.6);
    giveWeapon(embers[0], 'kestrel'); switchTo(embers[0], 'primary');
    return { steps: 24, fireAt: [] };
  }

  if (name === 'combat') {
    state.phaseT = 63;
    kitPlayer('kestrel');
    p.hp = 74;
    p.ammo.kestrel.mag = 17;
    stage(p, 7.4, -0.6, -1.28);
    const wardens = botsOf('warden');
    stage(wardens[0], 17, -3.5, 2.2);
    stage(wardens[1], 21.5, 2.5, 2.6);
    giveWeapon(wardens[0], 'kestrel'); switchTo(wardens[0], 'primary');
    const embers = botsOf('ember');
    stage(embers[0], 6.0, 2.2, -1.1);
    return { steps: 30, fireAt: [16, 23] };
  }

  if (name === 'plant') {
    // Planting at the Depot: open dusk light, containers for a backdrop, a teammate covering
    // the lane the Wardens would retake through.
    state.phaseT = 58;
    state.planSite = 'B';
    kitPlayer('kestrel');
    stage(p, 21.6, 25.9, -0.92);
    p.crouch = true;
    p.channel = { kind: 'plant', t: 2.0, need: 3.2 };
    const embers = botsOf('ember');
    stage(embers[0], 26.5, 20.6, 2.75);
    giveWeapon(embers[0], 'kestrel'); switchTo(embers[0], 'primary');
    stage(embers[1], 17.2, 21.5, -1.2);
    return { steps: 3, fireAt: [] };
  }

  return { steps: 2, fireAt: [] };
}
