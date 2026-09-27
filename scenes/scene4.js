/* SAHNE 4 — PRİZMA KUR (46–64 s) */
(function (LI) {
  'use strict';
  const KD = LI.KD, F = () => LI.Film;
  function camera(t, env) { return LI.Camera.breathe(KD.cam(env, { zoom: 1 }), t, 0.4); }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 4, start: 46, end: 64, name: "Build a prism", nameTr: "Prizma kur", concept: "12 cubes, three prisms", conceptTr: "12 küp, üç prizma", render });
})(window.LI = window.LI || {});
