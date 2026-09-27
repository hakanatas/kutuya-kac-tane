/* SAHNE 1 — İKİ KUTU (0–10 s)  Hangisine daha çok şey sığar?
   The whole film's drawing lives in LI.world(t); each scene only sets the camera. */
(function (LI) {
  'use strict';
  const { seg, lerp, inOut } = LI.E;
  const KD = LI.KD, F = () => LI.Film, A = LI.Ang, Ink = LI.Ink;
  const END = (t) => 1 - seg(t, 90.4, 91.4);

  function win(t, a, b, fi = 0.4, fo = 0.4) { return seg(t, a, a + fi) * (1 - seg(t, b - fo, b)); }
  function exprs(ctx, t, P, list, sz) {
    const f = F();
    list.forEach(([a, b, items, hot]) => {
      const al = win(t, a, b); if (al <= 0) return;
      f.expr(ctx, typeof items === 'string' ? [items] : items, P.x, P.y, sz ?? P.s, { alpha: al, w: P.w, halo: true, color: hot ? A.amber : undefined });
    });
  }
  const at = (P, k, y) => ({ x: P.x, y: y ?? P.y[k], s: P.s, w: P.w });
  const amber = (a) => `rgba(${LI.AMBER_RGB},${a})`;
  const fr = (n, d, h) => F().fr(n, d, h);
  const neg = (s) => s.replace('-', '−');
  const label = (v) => (v < 0 ? neg(String(v)) : String(v));

  /* ---- boxes and equal objects: cabinet projection, x right, y back, z up ---- */
  const Pj = (O, c, x, y, z) => [O[0] + x * c + y * c * 0.5, O[1] - z * c - y * c * 0.5];
  function poly(ctx, P, a, fill, seed, w = 3) {
    ctx.beginPath(); P.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath();
    ctx.fillStyle = `rgba(${LI.PAPER_RGB},${a})`; ctx.fill();
    fill.forEach((f) => { if (f) { ctx.fillStyle = f; ctx.fill(); } });
    Ink.path(ctx, P.concat([P[0]]), { w, alpha: a * 0.9, seed, taper: [0, 0] });
  }
  /** a solid block x..x+dx, y..y+dy, z..z+dz */
  function block(ctx, O, c, x, y, z, dx, dy, dz, a, h, seed) {
    if (a <= 0) return;
    const P = (i, j, k) => Pj(O, c, x + i * dx, y + j * dy, z + k * dz), H = h > 0 ? amber(a * 0.6 * h) : null;
    poly(ctx, [P(0, 0, 1), P(1, 0, 1), P(1, 1, 1), P(0, 1, 1)], a, [amber(a * 0.2), H], seed, 2.5);
    poly(ctx, [P(1, 0, 0), P(1, 1, 0), P(1, 1, 1), P(1, 0, 1)], a, [`rgba(${LI.INK_RGB},${a * 0.14})`, H], seed + 1, 2.5);
    poly(ctx, [P(0, 0, 0), P(1, 0, 0), P(1, 0, 1), P(0, 0, 1)], a, [`rgba(${LI.INK_RGB},${a * 0.04})`, H], seed + 2, 2.5);
  }
  function ball(ctx, O, c, x, y, z, a, seed) {
    if (a <= 0) return; const C = Pj(O, c, x + 0.5, y + 0.5, z + 0.5), r = c * 0.47;
    ctx.beginPath(); ctx.arc(C[0], C[1], r, 0, 7);
    ctx.fillStyle = `rgba(${LI.PAPER_RGB},${a})`; ctx.fill();
    const g = ctx.createRadialGradient(C[0] - r * 0.35, C[1] - r * 0.35, r * 0.1, C[0], C[1], r);
    g.addColorStop(0, amber(a * 0.12)); g.addColorStop(1, amber(a * 0.45)); ctx.fillStyle = g; ctx.fill();
    const P = []; for (let i = 0; i <= 28; i++) P.push([C[0] + r * Math.cos(i / 28 * 6.2832), C[1] + r * Math.sin(i / 28 * 6.2832)]);
    Ink.path(ctx, P, { w: 2.5, alpha: a * 0.9, seed, taper: [0, 0] });
  }
  /** items [{x,y,z,dx,dy,dz}] in painter's order, each with a fill index i */
  function fillList(L, W, H, dx = 1) {
    const out = [];
    for (let z = 0; z < H; z++) for (let y = W - 1; y >= 0; y--) for (let x = 0; x < L; x += dx) out.push({ x, y, z, dx, dy: 1, dz: 1 });
    out.forEach((q, i) => (q.i = i));
    return out.slice().sort((p, q) => q.y - p.y || p.x - q.x || p.z - q.z);
  }
  const shown = (t, t0, dt, n) => Math.max(0, Math.min(n, Math.floor((t - t0) / dt + 0.4)));
  /** an open glass box: back walls first, then the contents, then the front edges */
  function container(ctx, O, c, L, W, H, a, seed, draw) {
    if (a <= 0) return;
    const P = (x, y, z) => Pj(O, c, x, y, z), ink = `rgba(${LI.INK_RGB},${a * 0.05})`;
    poly(ctx, [P(0, W, 0), P(L, W, 0), P(L, W, H), P(0, W, H)], a * 0.8, [ink], seed, 2);
    poly(ctx, [P(0, 0, 0), P(0, W, 0), P(0, W, H), P(0, 0, H)], a * 0.8, [ink], seed + 1, 2);
    poly(ctx, [P(0, 0, 0), P(L, 0, 0), P(L, W, 0), P(0, W, 0)], a * 0.8, [ink], seed + 2, 2);
    if (draw) draw();
    [[[0, 0, 0], [L, 0, 0]], [[L, 0, 0], [L, 0, H]], [[L, 0, H], [0, 0, H]], [[0, 0, H], [0, 0, 0]], [[L, 0, 0], [L, W, 0]], [[L, W, 0], [L, W, H]], [[L, W, H], [L, 0, H]], [[0, W, H], [L, W, H]], [[0, 0, H], [0, W, H]]]
      .forEach(([p, q], i) => Ink.path(ctx, [P(...p), P(...q)], { w: 3, alpha: a * 0.85, seed: seed + 10 + i, taper: [0, 0] }));
  }
  function fillBox(ctx, O, c, L, W, H, t, t0, dt, a, seed, kind = 'cube', hot = 0) {
    const dx = kind === 'brick' ? 2 : 1, items = fillList(L, W, H, dx);
    container(ctx, O, c, L, W, H, a, seed, () => items.forEach((q) => {
      const k = seg(t, t0 + q.i * dt, t0 + q.i * dt + 0.35); if (k <= 0) return;
      const dz = (1 - inOut(k)) * (H + 1 - q.z);
      if (kind === 'ball') ball(ctx, O, c, q.x, q.y, q.z + dz, a * k, seed + 100 + q.i * 3);
      else block(ctx, O, c, q.x, q.y, q.z + dz, q.dx, 1, 1, a * k, hot, seed + 100 + q.i * 3);
    }));
    return items.length;
  }
  function tag(ctx, env, O, c, L, text, a, hot) {
    if (a <= 0) return; const s = KD.L(env).G.s;
    F().T(ctx, text, O[0] + L * c / 2, O[1] + s * 0.95, { size: s * 0.66, alpha: a, halo: true, color: hot ? A.amber : undefined });
  }
  /** a free-standing prism built from equal cubes */
  function prism(ctx, O, c, L, W, H, t, t0, dt, a, seed) {
    if (a <= 0) return;
    fillList(L, W, H).forEach((q) => { const k = seg(t, t0 + q.i * dt, t0 + q.i * dt + 0.35); if (k > 0) block(ctx, O, c, q.x, q.y, q.z + (1 - inOut(k)) * 1.5, 1, 1, 1, a * k, 0, seed + q.i * 3); });
  }

  function context(ctx, env, t) {
    exprs(ctx, t, KD.L(env).CX, [
      [4.4, 10.2, 'Hangi kutuya daha çok şey sığar?'],
      [10.6, 27.8, 'Kutuları eş küplerle dolduralım'],
      [28.4, 45.8, 'Başka eş nesnelerle dolduralım'],
      [46.4, 63.8, 'Eş küplerle prizma oluşturalım'],
      [64.4, 79.8, 'Her nesne hacmi ölçer mi?'],
    ]);
  }

  function figure(ctx, env, t) {
    const L = KD.L(env), a = END(t), c = L.ST.c, O1 = [L.P1.x, L.P1.y], O2 = [L.P2.x, L.P2.y];
    // S1–S2: a long box and a cube box
    const a1 = win(t, 4.6, 27.8) * a;
    if (a1 > 0) {
      fillBox(ctx, O1, c, 6, 2, 2, t, 11.4, 0.18, a1 * seg(t, 4.8, 5.4), 30000);
      fillBox(ctx, O2, c, 3, 3, 3, t, 16.2, 0.16, a1 * seg(t, 5.4, 6.0), 31000, 'cube', win(t, 24.2, 27.8) * 0.5);
      const n1 = shown(t, 11.4, 0.18, 24), n2 = shown(t, 16.2, 0.16, 27);
      tag(ctx, env, O1, c, 6, t < 11.4 ? '?' : `${n1} küp`, a1 * seg(t, 6.4, 6.8), false);
      tag(ctx, env, O2, c, 3, t < 16.2 ? '?' : `${n2} küp`, a1 * seg(t, 6.4, 6.8), t > 24.2);
    }
    // S3: the same long box with bricks and with cubes
    const a3 = win(t, 28.8, 45.8) * a;
    if (a3 > 0) {
      fillBox(ctx, O1, c, 6, 2, 2, t, 29.8, 0.32, a3, 32000, 'brick');
      fillBox(ctx, O2, c, 6, 2, 2, t, 34.2, 0.15, a3 * seg(t, 33.6, 34.2), 33000);
      tag(ctx, env, O1, c, 6, `${shown(t, 29.8, 0.32, 12)} tuğla`, a3 * seg(t, 29.8, 30.2), t > 41.4);
      tag(ctx, env, O2, c, 6, `${shown(t, 34.2, 0.15, 24)} küp`, a3 * seg(t, 34.2, 34.6), t > 41.4);
    }
    // S4: 12 equal cubes, three prisms
    const a4 = win(t, 46.8, 63.8) * a, cq = L.cq, Q = L.Q;
    if (a4 > 0) {
      [[12, 1, 1, 47.4], [6, 2, 1, 50.0], [3, 2, 2, 52.6]].forEach(([l, w, h, t0], i) => {
        prism(ctx, Q[i], cq, l, w, h, t, t0, 0.15, a4, 34000 + i * 500);
        tag(ctx, env, Q[i], cq, l, `${l} × ${w} × ${h}: 12 küp`, a4 * seg(t, t0 + 1.9, t0 + 2.3), t > 55.6);
      });
    }
    // S5: balls leave gaps, cubes do not
    const a5 = win(t, 64.8, 79.8) * a;
    if (a5 > 0) {
      fillBox(ctx, O1, c, 4, 2, 2, t, 65.4, 0.2, a5, 35000, 'ball');
      fillBox(ctx, O2, c, 4, 2, 2, t, 69.2, 0.2, a5 * seg(t, 68.6, 69.2), 36000);
      tag(ctx, env, O1, c, 4, `${shown(t, 65.4, 0.2, 16)} top, boşluklu`, a5 * seg(t, 65.4, 65.8), false);
      tag(ctx, env, O2, c, 4, `${shown(t, 69.2, 0.2, 16)} küp, boşluksuz`, a5 * seg(t, 69.2, 69.6), t > 74.6);
    }
  }

  function words(ctx, env, t) {
    const W = KD.L(env).W;
    exprs(ctx, t, at(W, 0), [[6.0, 10.2, 'Uzun kutu mu, küp biçimli kutu mu?'],
      [11.4, 20.8, 'İçlerini eş küplerle dolduralım ve sayalım'], [21.0, 27.8, 'Uzun kutuya 24, küp kutuya 27 küp sığdı'],
      [29.4, 45.8, 'Aynı uzun kutu: bir kez tuğlalarla, bir kez küplerle'],
      [47.4, 63.8, '12 eş küple farklı prizmalar oluşturalım'],
      [65.4, 79.8, 'Aynı kutuları toplarla ve küplerle dolduralım']]);
    exprs(ctx, t, at(W, 1), [[8.6, 10.2, 'Uzun kutu daha büyük görünüyor… öyle mi?'], [22.6, 27.8, 'Hacim: kutuyu dolduran eş nesnelerin sayısı'],
      [38.6, 45.8, '1 tuğla = 2 küp, 12 tuğla = 24 küp'],
      [55.6, 63.8, 'Biçimleri farklı, hacimleri aynı: 12 küp'],
      [72.8, 79.8, 'Toplar arasında boşluk kalıyor, küpler tam dolduruyor']]);
    exprs(ctx, t, at(W, 2), [[24.2, 27.8, 'Küp kutunun hacmi daha büyük: 27 > 24', true],
      [41.4, 45.8, 'Hacim, seçilen eş nesneyle söylenir', true],
      [58.6, 63.8, 'Prizmanın hacmi = onu oluşturan eş nesnelerin sayısı', true],
      [75.0, 79.8, 'Hacmi boşluksuz dolduran eş nesnelerle ölçeriz', true]]);
  }

  function summary(ctx, env, t) {
    if (t < 80.4) return;
    const S = KD.L(env).SUM, f = F(), a = END(t);
    [['Kutuları eş nesnelerle doldur, karşılaştır', 80.6], ['Hacim = dolduran eş nesnelerin sayısı', 81.6], ['Nesne değişince sayı değişir', 82.6], ['Eş nesneler boşluksuz doldurmalı!', 83.6, true]].forEach(([s, t0, hot], i) => {
      const al = seg(t, t0, t0 + 0.4) * a; if (al <= 0) return;
      f.expr(ctx, [s], S.x, S.y[i], S.s * (i === 3 ? 1.1 : 1), { alpha: al, w: S.w, halo: true, color: hot ? A.amber : undefined });
    });
  }

  LI.fireworks = function (ctx, env, t) {
    const k = seg(t, 84.4, 86.4);
    if (k <= 0 || t >= 91) return;
    const n = F().nokta(t, env), C = [n.x, n.y - 170];
    [30, 60, 90, 120, 150].forEach((d, i) => {
      const r = 150 + 30 * Math.sin(t * 2 + i);
      A.arc(ctx, C, r, d - 12, d + 12, { p: seg(k, i * 0.12, i * 0.12 + 0.4), alpha: 0.8 * (1 - seg(t, 90.2, 91)), w: 6, seed: 80 + i });
    });
  };

  LI.world = function (ctx, env, t) { context(ctx, env, t); figure(ctx, env, t); words(ctx, env, t); summary(ctx, env, t); };

  function camera(t, env) {
    const L = KD.L(env);
    return LI.Camera.breathe(LI.Camera.track([
      [0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [3.0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [4.8, KD.cam(env, { zoom: 1 })],
    ], t), t, 0.5);
  }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 1, start: 0, end: 10, name: 'Two boxes', nameTr: 'İki kutu', concept: 'Which holds more?', conceptTr: 'Hangisine çok sığar?', render });
})(window.LI = window.LI || {});
