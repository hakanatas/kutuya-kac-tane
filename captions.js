/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   Kısa, tek fikir, 7. sınıf dili. start/end saniye cinsinden.
   note: öğretmen için önerilen seslendirme cümlesi.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 4.4, end: 10.2, tr: 'Hangisine daha çok sığar?', en: 'Which one holds more?',
      note: 'İki kutu var: biri uzun, biri küp biçiminde. Hangisinin içine daha çok şey sığar? Uzun kutu daha büyük görünüyor, öyle mi?' },
    { scene: 2, start: 10.8, end: 20.8, tr: 'Eş küplerle dolduralım', en: 'Fill them with equal cubes',
      note: 'İki kutuyu da eş küplerle dolduralım ve sayalım. Uzun kutuya 24 küp, küp biçimli kutuya 27 küp sığdı.' },
    { scene: 2, start: 21.0, end: 27.8, tr: 'Hacim: eş nesnelerin sayısı', en: 'Volume: the number of equal objects',
      note: 'Kutuyu dolduran eş nesnelerin sayısı, kutunun hacmini söyler. 27, 24’ten büyük: küp biçimli kutunun hacmi daha büyük.' },
    { scene: 3, start: 28.8, end: 38.4, tr: 'Tuğlalarla dolduralım', en: 'Fill it with bricks',
      note: 'Aynı uzun kutuyu bu kez tuğlalarla dolduralım: 12 tuğla sığdı. Küplerle doldurunca 24 küp.' },
    { scene: 3, start: 38.6, end: 45.8, tr: '12 tuğla = 24 küp', en: '12 bricks = 24 cubes',
      note: 'Bir tuğla iki küp kadar. 12 tuğla, 24 küp eder. Hacmi söylerken hangi eş nesneyle saydığımızı da söyleriz.' },
    { scene: 4, start: 46.8, end: 55.4, tr: '12 küple prizmalar', en: 'Prisms from 12 cubes',
      note: '12 eş küple farklı dikdörtgenler prizmaları oluşturalım: 12’ye 1’e 1, 6’ya 2’ye 1, 3’e 2’ye 2.' },
    { scene: 4, start: 55.6, end: 63.8, tr: 'Biçim farklı, hacim aynı', en: 'Different shapes, the same volume',
      note: 'Biçimleri farklı ama üçü de 12 küpten oluşuyor. Prizmanın hacmi, onu oluşturan eş nesnelerin sayısıdır: 12 küp.' },
    { scene: 5, start: 64.8, end: 72.6, tr: 'Toplar mı, küpler mi?', en: 'Balls or cubes?',
      note: 'Aynı kutuları toplarla ve küplerle dolduralım. İkisine de 16 tane sığdı.' },
    { scene: 5, start: 72.8, end: 79.8, tr: 'Boşluksuz dolduran nesne', en: 'An object that leaves no gaps',
      note: 'Toplar arasında boşluk kalıyor, küpler kutuyu tam dolduruyor. Hacmi ölçmek için boşluksuz dolduran eş nesneler seçeriz.' },
    { scene: 6, start: 80.6, end: 86.4, tr: 'Hacim = eş nesnelerin sayısı', en: 'Volume = the number of equal objects',
      note: 'Aklında kalsın: prizmanın hacmi, onu boşluksuz dolduran eş nesnelerin sayısıdır.' },
    { scene: 6, start: 86.8, end: 91.0, tr: 'Boşluksuz doldur!', en: 'Leave no gaps!',
      note: 'Eş nesneler boşluk bırakmadan doldurmalı!' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
