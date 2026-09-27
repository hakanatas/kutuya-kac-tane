/* SAHNE 3 — BAŞKA NESNE (28–46 s) */
(function (LI) {
  'use strict';
  const KD = LI.KD, F = () => LI.Film;
  function camera(t, env) { return LI.Camera.breathe(KD.cam(env, { zoom: 1 }), t, 0.4); }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 3, start: 28, end: 46, name: "Another object", nameTr: "Başka nesne", concept: "12 bricks = 24 cubes", conceptTr: "12 tuğla = 24 küp", render });
})(window.LI = window.LI || {});
