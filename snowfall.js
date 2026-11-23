/* Seasonal snowfall: a light, decorative layer that never blocks the page.
 *
 * To switch it off early, set ENABLED to false. Otherwise it only runs between
 * SEASON_START and SEASON_END (month-day, inclusive, wraps over New Year), so it
 * switches itself off after the season and back on next year.
 * Preview outside the season with ?snow=on, or hide it with ?snow=off.
 */
(() => {
  const ENABLED = true;
  const SEASON_START = '11-20';
  const SEASON_END = '01-06';

  const param = new URLSearchParams(location.search).get('snow');
  if (param === 'off' || (!ENABLED && param !== 'on')) return;
  const today = new Date();
  const monthDay = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const inSeason = SEASON_START <= SEASON_END
    ? monthDay >= SEASON_START && monthDay <= SEASON_END
    : monthDay >= SEASON_START || monthDay <= SEASON_END;
  if (!inSeason && param !== 'on') return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.createElement('canvas');
  canvas.className = 'seasonal-snow';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:80;pointer-events:none';
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // One soft flake drawn once, then stamped at different sizes. The pale blue
  // halo keeps flakes faintly visible on white sections as well as the navy hero.
  const SPRITE = 64;
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = SPRITE;
  const s = sprite.getContext('2d');
  const glow = s.createRadialGradient(SPRITE / 2, SPRITE / 2, 0, SPRITE / 2, SPRITE / 2, SPRITE / 2);
  glow.addColorStop(0, 'rgba(255,255,255,1)');
  glow.addColorStop(0.35, 'rgba(255,255,255,0.9)');
  glow.addColorStop(0.6, 'rgba(196,220,240,0.45)');
  glow.addColorStop(1, 'rgba(196,220,240,0)');
  s.fillStyle = glow;
  s.fillRect(0, 0, SPRITE, SPRITE);

  let width = 0, height = 0, flakes = [], frame = 0, last = 0, running = false;
  const random = (min, max) => min + Math.random() * (max - min);

  function makeFlake(anywhere) {
    const depth = Math.random();            // 0 = far, 1 = near
    const size = 3 + depth * depth * 7;      // mostly small, a few larger
    return {
      x: random(0, width),
      y: anywhere ? random(-height, height) : random(-40, -size),
      size,
      speed: 18 + depth * 34,                // px per second: slow, gentle fall
      sway: random(8, 22),
      swaySpeed: random(0.25, 0.6),
      phase: random(0, Math.PI * 2),
      alpha: 0.35 + depth * 0.5,
    };
  }

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    // Sparse: roughly one flake per 26,000 px², capped for large and small screens.
    const target = Math.max(14, Math.min(55, Math.round((width * height) / 26000)));
    while (flakes.length < target) flakes.push(makeFlake(true));
    flakes.length = target;
  }

  function draw(time) {
    const dt = Math.min((time - last) / 1000 || 0, 0.05);
    last = time;
    ctx.clearRect(0, 0, width, height);
    for (const flake of flakes) {
      flake.y += flake.speed * dt;
      flake.phase += flake.swaySpeed * dt;
      if (flake.y > height + flake.size) Object.assign(flake, makeFlake(false));
      const x = flake.x + Math.sin(flake.phase) * flake.sway;
      ctx.globalAlpha = flake.alpha;
      ctx.drawImage(sprite, x - flake.size, flake.y - flake.size, flake.size * 2, flake.size * 2);
    }
    frame = requestAnimationFrame(draw);
  }

  function start() {
    if (running || reducedMotion.matches || document.hidden) return;
    running = true;
    if (!canvas.isConnected) document.body.append(canvas);
    resize();
    last = performance.now();
    frame = requestAnimationFrame(draw);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(frame);
    canvas.remove();
  }

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => running && resize(), 150);
  }, { passive: true });
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  reducedMotion.addEventListener?.('change', () => (reducedMotion.matches ? stop() : start()));

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
