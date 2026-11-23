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
  const random = (min, max) => min + Math.random() * (max - min);
  const pick = list => list[Math.floor(Math.random() * list.length)];

  function sprite(size, paint) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    paint(c.getContext('2d'), size / 2);
    return c;
  }

  // Six-armed ice crystals, each with its own randomised branching so no two
  // variants look alike. A cool blue glow keeps them readable on white sections.
  function crystal() {
    const branches = Array.from({ length: 2 + Math.floor(Math.random() * 2) }, (_, i) => ({
      at: 0.3 + i * random(0.18, 0.24),
      length: random(0.16, 0.32) * (1 - i * 0.22),
      angle: random(0.75, 1.05),
    }));
    const tip = Math.random() < 0.5;
    const plate = random(0.1, 0.2);
    return sprite(128, (g, r) => {
      const arm = r * 0.78;
      g.translate(r, r);
      g.lineCap = 'round';
      g.lineJoin = 'round';
      g.strokeStyle = 'rgba(255,255,255,0.96)';
      g.fillStyle = 'rgba(255,255,255,0.9)';
      g.shadowColor = 'rgba(190,220,255,0.95)';
      g.shadowBlur = r * 0.18;
      for (let k = 0; k < 6; k++) {
        g.save();
        g.rotate((k * TAU) / 6);
        g.lineWidth = r * 0.06;
        g.beginPath();
        g.moveTo(0, 0);
        g.lineTo(0, -arm);
        for (const b of branches) {
          const y = -arm * b.at;
          const len = arm * b.length;
          g.moveTo(0, y);
          g.lineTo(Math.sin(b.angle) * len, y - Math.cos(b.angle) * len);
          g.moveTo(0, y);
          g.lineTo(-Math.sin(b.angle) * len, y - Math.cos(b.angle) * len);
        }
        g.stroke();
        if (tip) {
          g.beginPath();
          g.arc(0, -arm, r * 0.05, 0, TAU);
          g.fill();
        }
        g.restore();
      }
      // Small hexagonal plate at the centre.
      g.beginPath();
      for (let k = 0; k < 6; k++) g.lineTo(Math.cos((k * TAU) / 6) * r * plate, Math.sin((k * TAU) / 6) * r * plate);
      g.closePath();
      g.fill();
    });
  }

  // Out-of-focus foreground flake: a soft disc with a slightly brighter rim,
  // like a camera's bokeh.
  const bokeh = sprite(128, (g, r) => {
    const disc = g.createRadialGradient(r, r, 0, r, r, r);
    disc.addColorStop(0, 'rgba(255,255,255,0.55)');
    disc.addColorStop(0.6, 'rgba(245,250,255,0.65)');
    disc.addColorStop(0.8, 'rgba(255,255,255,0.9)');
    disc.addColorStop(0.9, 'rgba(230,242,255,0.35)');
    disc.addColorStop(1, 'rgba(210,228,248,0)');
    g.fillStyle = disc;
    g.fillRect(0, 0, r * 2, r * 2);
  });

  // Distant flakes: tiny soft points of light.
  const haze = sprite(32, (g, r) => {
    const dot = g.createRadialGradient(r, r, 0, r, r, r);
    dot.addColorStop(0, 'rgba(255,255,255,1)');
    dot.addColorStop(0.4, 'rgba(240,248,255,0.7)');
    dot.addColorStop(1, 'rgba(190,215,240,0)');
    g.fillStyle = dot;
    g.fillRect(0, 0, r * 2, r * 2);
  });

  let crystals = null;
  let width = 0, height = 0, flakes = [], frame = 0, last = 0, clock = 0, running = false;

  // Three depth layers move at different speeds for parallax.
  const LAYERS = {
    far:   { share: 0.5,  size: [2, 4.5],  speed: [14, 24], alpha: [0.35, 0.6],  wind: 0.4 },
    mid:   { share: 0.42, size: [9, 17],   speed: [26, 42], alpha: [0.6, 0.9],   wind: 0.75 },
    near:  { share: 0.08, size: [18, 34],  speed: [46, 64], alpha: [0.22, 0.38],   wind: 1.2 },
  };

  function makeFlake(layer, anywhere) {
    const spec = LAYERS[layer];
    const size = random(...spec.size);
    return {
      layer,
      image: layer === 'mid' ? pick(crystals) : layer === 'near' ? bokeh : haze,
      size,
      x: random(-40, width + 40),
      y: anywhere ? random(-size, height) : random(-80, -size * 2),
      speed: random(...spec.speed),
      alpha: random(...spec.alpha),
      wind: spec.wind,
      sway: random(10, 26),
      swaySpeed: random(0.3, 0.75),
      phase: random(0, TAU),
      rotation: random(0, TAU),
      spin: random(-0.5, 0.5),
      tumble: random(0.35, 0.9),
      tumblePhase: random(0, TAU),
      shimmer: random(1.2, 2.6),
    };
  }

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    // Sparse: about one flake per 22,000 px², capped for large and small screens.
    const total = Math.max(18, Math.min(70, Math.round((width * height) / 22000)));
    const next = [];
    for (const layer of Object.keys(LAYERS)) {
      const count = Math.max(layer === 'near' ? 2 : 1, Math.round(total * LAYERS[layer].share));
      const existing = flakes.filter(f => f.layer === layer).slice(0, count);
      while (existing.length < count) existing.push(makeFlake(layer, true));
      next.push(...existing);
    }
    // Draw far to near so foreground bokeh sits on top.
    flakes = next.sort((a, b) => a.size - b.size);
  }

  function draw(time) {
    const dt = Math.min((time - last) / 1000 || 0, 0.05);
    last = time;
    clock += dt;
    // Slowly changing gusts, so the whole field drifts together like real wind.
    const gust = Math.sin(clock * 0.11) * 14 + Math.sin(clock * 0.37 + 1.3) * 6 + Math.sin(clock * 0.07 + 4) * 8;
    ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const scale = canvas.width / width;
    for (const f of flakes) {
      f.phase += f.swaySpeed * dt;
      f.y += f.speed * dt;
      f.x += (gust * f.wind + Math.sin(f.phase * 0.7) * 4) * dt;
      if (f.y > height + f.size * 2 || f.x < -80 || f.x > width + 80) {
        Object.assign(f, makeFlake(f.layer, false));
        continue;
      }
      const x = f.x + Math.sin(f.phase) * f.sway;
      let alpha = f.alpha;
      if (f.layer === 'mid') {
        f.rotation += f.spin * dt;
        alpha *= 0.82 + 0.18 * Math.sin(clock * f.shimmer + f.phase * 3);
        // Flatten one axis over time so the crystal appears to tumble in 3D.
        const tilt = 0.35 + 0.65 * Math.abs(Math.cos(clock * f.tumble + f.tumblePhase));
        const cos = Math.cos(f.rotation) * scale, sin = Math.sin(f.rotation) * scale;
        ctx.setTransform(cos * tilt, sin * tilt, -sin, cos, x * scale, f.y * scale);
        ctx.globalAlpha = alpha;
        ctx.drawImage(f.image, -f.size, -f.size, f.size * 2, f.size * 2);
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
      } else {
        // Screen blending makes the soft flakes glow like light rather than
        // sit on the page as flat grey discs.
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = alpha;
        ctx.drawImage(f.image, x - f.size, f.y - f.size, f.size * 2, f.size * 2);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    frame = requestAnimationFrame(draw);
  }

  function start() {
    if (running || reducedMotion.matches || document.hidden) return;
    running = true;
    crystals ??= Array.from({ length: 6 }, crystal);
    if (!canvas.isConnected) document.body.append(canvas);
    resize();
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
