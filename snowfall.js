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
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:80;pointer-events:none;opacity:0;transition:opacity 2.4s ease';
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const TAU = Math.PI * 2;
  const SIXTY = Math.PI / 3;
  const random = (min, max) => min + Math.random() * (max - min);
  const pick = list => list[Math.floor(Math.random() * list.length)];
  const SPRITE = 160;

  /* ---------- Crystal designs ----------
   * Every flake is a six-fold ice crystal. Side branches leave the spine at
   * 60 degrees, as they do in real snow. Each design is drawn in local units
   * where the arm runs from 0 to -1.
   */
  function twig(g, x, y, len, dir) {
    g.moveTo(x, y);
    g.lineTo(x + Math.sin(dir) * len, y - Math.cos(dir) * len);
  }
  function hexagon(g, radius, rotate = 0) {
    for (let k = 0; k <= 6; k++) {
      const a = rotate + (k * TAU) / 6;
      k ? g.lineTo(Math.cos(a) * radius, Math.sin(a) * radius) : g.moveTo(Math.cos(a) * radius, Math.sin(a) * radius);
    }
  }

  const designs = {
    // Classic stellar dendrite: long branches carrying their own small twigs.
    dendrite(g) {
      const pairs = 3 + Math.floor(Math.random() * 2);
      const spec = Array.from({ length: pairs }, (_, i) => ({ at: 0.28 + i * (0.6 / pairs) + random(-0.03, 0.03), len: random(0.24, 0.36) * (1 - i * 0.2) }));
      return arm => {
        arm.moveTo(0, 0); arm.lineTo(0, -1);
        for (const b of spec) for (const side of [-1, 1]) {
          const dir = side * SIXTY;
          twig(arm, 0, -b.at, b.len, dir);
          const mx = Math.sin(dir) * b.len * 0.55, my = -b.at - Math.cos(dir) * b.len * 0.55;
          twig(arm, mx, my, b.len * 0.35, dir - side * SIXTY);
        }
      };
    },
    // Fern-like: many short, evenly tapering branches.
    fern(g) {
      const count = 6 + Math.floor(Math.random() * 3);
      const reach = random(0.18, 0.26);
      return arm => {
        arm.moveTo(0, 0); arm.lineTo(0, -1);
        for (let i = 0; i < count; i++) {
          const at = 0.2 + (i / count) * 0.75;
          const len = reach * (1 - at * 0.8);
          for (const side of [-1, 1]) twig(arm, 0, -at, len, side * SIXTY);
        }
      };
    },
    // Stellar plate: broad hexagonal centre with ribbed arms ending in little plates.
    plate(g) {
      const centre = random(0.24, 0.32);
      const tip = random(0.08, 0.12);
      return (arm, k) => {
        arm.moveTo(0, -centre * 0.9); arm.lineTo(0, -1 + tip);
        for (const side of [-1, 1]) twig(arm, 0, -0.62, random(0.12, 0.16), side * SIXTY);
        // Small plate at the tip of each arm.
        arm.moveTo(0, -1 + tip);
        for (let j = 0; j <= 6; j++) {
          const a = (j * TAU) / 6;
          arm.lineTo(Math.sin(a) * tip, -1 + Math.cos(a) * tip);
        }
        if (k === 0) { hexagon(arm, centre, Math.PI / 6); hexagon(arm, centre * 0.55, Math.PI / 6); }
        // Ribs inside the central plate.
        arm.moveTo(0, 0); arm.lineTo(0, -centre * 0.55);
      };
    },
    // Sectored: arms with broad leaf-like sides and a fine spine.
    sectored(g) {
      const width = random(0.12, 0.18);
      return arm => {
        arm.moveTo(0, 0); arm.lineTo(0, -1);
        arm.moveTo(0, -0.18);
        arm.lineTo(-width, -0.5); arm.lineTo(0, -0.86); arm.lineTo(width, -0.5); arm.closePath();
        for (const side of [-1, 1]) twig(arm, 0, -0.9, 0.1, side * SIXTY);
      };
    },
  };

  function drawCrystal(g, size, shape, { glow, line }) {
    const r = size / 2;
    const arm = r * 0.84;
    g.save();
    g.translate(r, r);
    g.scale(arm, arm);
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.lineWidth = line;
    g.strokeStyle = 'rgba(255,255,255,0.97)';
    g.shadowColor = glow;
    g.shadowBlur = r * 0.12;
    g.beginPath();
    for (let k = 0; k < 6; k++) {
      g.save();
      g.rotate((k * TAU) / 6);
      shape(g, k);
      g.restore();
    }
    g.stroke();
    // A tiny bright core where the arms meet.
    g.fillStyle = 'rgba(255,255,255,0.95)';
    g.beginPath();
    g.arc(0, 0, line * 1.4, 0, TAU);
    g.fill();
    g.restore();
  }

  function canvasOf(size) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    return c;
  }

  // Each design yields a crisp sprite, a soft (out-of-focus) version for the
  // nearest flakes, and a glint sprite that flashes as the flake turns.
  function makeCrystal() {
    const shape = designs[pick(Object.keys(designs))]();
    const crisp = canvasOf(SPRITE);
    drawCrystal(crisp.getContext('2d'), SPRITE, shape, { glow: 'rgba(160,200,240,0.9)', line: 0.05 });
    // Depth blur that works in every browser: shrink, then scale back up smoothly.
    const small = canvasOf(28);
    const s = small.getContext('2d');
    s.drawImage(crisp, 0, 0, 28, 28);
    const soft = canvasOf(SPRITE);
    const so = soft.getContext('2d');
    so.imageSmoothingQuality = 'high';
    so.drawImage(small, 0, 0, SPRITE, SPRITE);
    so.globalAlpha = 0.5;
    so.drawImage(crisp, 0, 0);
    const glint = canvasOf(SPRITE);
    drawCrystal(glint.getContext('2d'), SPRITE, shape, { glow: 'rgba(255,255,255,1)', line: 0.07 });
    return { crisp, soft, glint };
  }


  /* ---------- Corner drifts ----------
   * Snow that lands near the bottom corners slowly builds two small drifts.
   * They are drawn once per growth step, not every frame, and the level is
   * kept for the visit so it carries over between pages.
   */
  const DRIFT_KEY = 'lw-snow-drift';
  let driftLevel = 0;
  try { driftLevel = Math.min(1, Number(sessionStorage.getItem(DRIFT_KEY)) || 0); } catch { /* storage blocked */ }
  let driftDrawn = -1, driftSaved = 0;
  const driftShape = [random(0, TAU), random(0, TAU), random(0, TAU), random(0, TAU)];
  const driftImage = canvasOf(1);
  let driftWidth = 0, driftHeight = 0;

  function driftSize() {
    driftWidth = Math.min(220, Math.max(110, width * 0.16));
    driftHeight = width < 600 ? 22 : 34;
  }

  function renderDrift(ratio) {
    const pad = 12;
    driftImage.width = Math.ceil((driftWidth + pad) * ratio);
    driftImage.height = Math.ceil((driftHeight + pad) * ratio);
    const g = driftImage.getContext('2d');
    g.setTransform(ratio, 0, 0, ratio, 0, 0);
    g.clearRect(0, 0, driftWidth + pad, driftHeight + pad);
    const base = driftHeight + pad;
    const [a, b, c, d] = driftShape;
    const surface = t => {
      const profile = Math.pow(1 - t, 1.5) * (0.88 + 0.08 * Math.sin(t * 9 + a) + 0.05 * Math.sin(t * 23 + b));
      return base - driftHeight * driftLevel * Math.max(0, profile);
    };
    g.beginPath();
    g.moveTo(0, base);
    for (let x = 0; x <= driftWidth; x += 3) g.lineTo(x, surface(x / driftWidth));
    g.lineTo(driftWidth, base);
    g.closePath();
    const fill = g.createLinearGradient(0, base - driftHeight, 0, base);
    fill.addColorStop(0, 'rgba(255,255,255,0.98)');
    fill.addColorStop(0.45, 'rgba(240,246,253,0.96)');
    fill.addColorStop(1, 'rgba(205,222,242,0.95)');
    g.fillStyle = fill;
    g.shadowColor = 'rgba(60,100,150,0.32)';
    g.shadowBlur = 8;
    g.shadowOffsetY = -1;
    g.fill();
    // Fine sparkles in the snow's surface.
    g.shadowBlur = 0;
    g.fillStyle = 'rgba(255,255,255,1)';
    for (let i = 0; i < 9; i++) {
      const t = (i + 0.5 + 0.4 * Math.sin(i * 7.3 + c)) / 10;
      const y = surface(t) + 2 + Math.abs(Math.sin(i * 3.1 + d)) * 3;
      if (y < base - 1) { g.beginPath(); g.arc(t * driftWidth, y, 0.7, 0, TAU); g.fill(); }
    }
    driftDrawn = driftLevel;
  }

  function addToDrift(amount) {
    driftLevel = Math.min(1, driftLevel + amount);
  }

  function drawDrifts(scale) {
    if (driftLevel < 0.02) return;
    if (Math.abs(driftLevel - driftDrawn) > 0.01) renderDrift(scale);
    const h = driftImage.height / scale, w = driftImage.width / scale;
    ctx.globalAlpha = 1;
    ctx.setTransform(scale, 0, 0, scale, 0, (height - h) * scale);
    ctx.drawImage(driftImage, 0, 0, w, h);
    ctx.setTransform(-scale, 0, 0, scale, width * scale, (height - h) * scale);
    ctx.drawImage(driftImage, 0, 0, w, h);
    if (clock - driftSaved > 2) {
      driftSaved = clock;
      try { sessionStorage.setItem(DRIFT_KEY, driftLevel.toFixed(3)); } catch { /* storage blocked */ }
    }
  }

  let crystals = null;
  let width = 0, height = 0, flakes = [], frame = 0, last = 0, clock = 0, running = false;
  let scrolled = window.scrollY;

  // Three depth layers move at different speeds for parallax.
  const LAYERS = {
    far:  { share: 0.45, size: [3.5, 6],  speed: [14, 22], alpha: [0.35, 0.55], wind: 0.45, sprite: 'soft', parallax: 0.45 },
    mid:  { share: 0.45, size: [8, 14],   speed: [24, 38], alpha: [0.7, 0.92],  wind: 0.75, sprite: 'crisp', parallax: 0.8 },
    near: { share: 0.10, size: [17, 24],  speed: [40, 56], alpha: [0.38, 0.55], wind: 1.15, sprite: 'soft', parallax: 1.1 },
  };

  function makeFlake(layer, anywhere) {
    const spec = LAYERS[layer];
    const size = random(...spec.size);
    const crystal = pick(crystals);
    return {
      layer,
      image: crystal[spec.sprite],
      glint: layer === 'far' ? null : crystal.glint,
      size,
      x: random(-40, width + 40),
      y: anywhere ? random(-size, height) : random(-80, -size * 2),
      speed: random(...spec.speed),
      alpha: random(...spec.alpha),
      wind: spec.wind,
      parallax: spec.parallax,
      sway: random(10, 24),
      swaySpeed: random(0.3, 0.7),
      phase: random(0, TAU),
      rotation: random(0, TAU),
      spin: random(-0.45, 0.45),
      tumble: random(0.3, 0.8),
      tumblePhase: random(0, TAU),
      glintSpeed: random(0.5, 1.1),
    };
  }

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    driftSize();
    driftDrawn = -1;
    // Sparse: about one flake per 24,000 px², capped for large and small screens.
    const total = Math.max(16, Math.min(60, Math.round((width * height) / 24000)));
    const next = [];
    for (const layer of Object.keys(LAYERS)) {
      const count = Math.max(layer === 'near' ? 2 : 1, Math.round(total * LAYERS[layer].share));
      const existing = flakes.filter(f => f.layer === layer).slice(0, count);
      while (existing.length < count) existing.push(makeFlake(layer, true));
      next.push(...existing);
    }
    // Draw far to near so the nearest flakes sit on top.
    flakes = next.sort((a, b) => a.size - b.size);
  }

  function draw(time) {
    const dt = Math.min((time - last) / 1000 || 0, 0.05);
    last = time;
    clock += dt;
    const scale = canvas.width / width;
    // Slowly changing gusts, so the whole field drifts together like real wind.
    const gust = Math.sin(clock * 0.11) * 14 + Math.sin(clock * 0.37 + 1.3) * 6 + Math.sin(clock * 0.07 + 4) * 8;
    // Snow belongs to the page: scrolling carries flakes with the content,
    // with distant flakes moving less than near ones for depth.
    const scrollDelta = window.scrollY - scrolled;
    scrolled = window.scrollY;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const f of flakes) {
      f.phase += f.swaySpeed * dt;
      f.y += f.speed * dt - scrollDelta * f.parallax;
      if (f.y < -f.size * 2 - 60) f.y += height + f.size * 4 + 120;
      f.x += (gust * f.wind + Math.sin(f.phase * 0.7) * 4) * dt;
      f.rotation += f.spin * dt;
      // Flakes reaching the bottom corners settle into the drifts.
      if (f.layer !== 'far' && scrollDelta === 0 && f.y > height - 6 && (f.x < driftWidth * 0.8 || f.x > width - driftWidth * 0.8)) {
        addToDrift(0.008 * (f.size / 10));
        Object.assign(f, makeFlake(f.layer, false));
        continue;
      }
      if (f.y > height + f.size * 2 || f.x < -80 || f.x > width + 80) {
        Object.assign(f, makeFlake(f.layer, false));
        continue;
      }
      const x = f.x + Math.sin(f.phase) * f.sway;
      // Flatten one axis over time so the crystal appears to tumble in 3D.
      const turn = Math.cos(clock * f.tumble + f.tumblePhase);
      const tilt = 0.3 + 0.7 * Math.abs(turn);
      const cos = Math.cos(f.rotation) * scale, sin = Math.sin(f.rotation) * scale;
      ctx.setTransform(cos * tilt, sin * tilt, -sin, cos, x * scale, f.y * scale);
      ctx.globalAlpha = f.alpha;
      ctx.drawImage(f.image, -f.size, -f.size, f.size * 2, f.size * 2);
      if (f.glint) {
        // A brief catch of light as the crystal turns face-on.
        const sparkle = Math.pow(Math.max(0, Math.sin(clock * f.glintSpeed + f.tumblePhase * 2)), 24) * Math.abs(turn);
        if (sparkle > 0.02) {
          ctx.globalAlpha = sparkle * (f.layer === 'near' ? 0.45 : 0.8);
          ctx.globalCompositeOperation = 'lighter';
          ctx.drawImage(f.glint, -f.size, -f.size, f.size * 2, f.size * 2);
          ctx.globalCompositeOperation = 'source-over';
        }
      }
    }
    // A slow steady build-up as well, so drifts appear even on short visits.
    addToDrift(dt / 300);
    drawDrifts(scale);
    frame = requestAnimationFrame(draw);
  }

  function start() {
    if (running || reducedMotion.matches || document.hidden) return;
    running = true;
    crystals ??= Array.from({ length: 8 }, makeCrystal);
    if (!canvas.isConnected) document.body.append(canvas);
    resize();
    scrolled = window.scrollY;
    last = performance.now();
    frame = requestAnimationFrame(draw);
    requestAnimationFrame(() => { canvas.style.opacity = '1'; });
  }

  function stop() {
    running = false;
    cancelAnimationFrame(frame);
    canvas.style.opacity = '0';
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
