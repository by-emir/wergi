/* ============================================================
   ============================================================
   💸 VERGİ OYUNU — OYUN MOTORU (PART 1)
   ============================================================
   Canvas, döngü, hareket, çizim, zaman sistemi
   Global namespace: window.VERGI.Oyun
   ============================================================
*/

(function () {
  "use strict";

  window.VERGI = window.VERGI || {};

  // ============================================================
  // OYUN SINIFI
  // ============================================================
  function Oyun() {
    // Canvas
    this.canvas = null;
    this.ctx = null;
    this.genislik = 800;
    this.yukseklik = 600;

    // Durum
    this.aktif = false;
    this.duraklatildi = false;
    this.oyunBitti = false;

    // Zaman
    this.gunSaniye = 120;        // Test için hızlı
    this.sonZaman = 0;
    this.deltaTime = 0;
    this.fps = 60;
    this.fpsSayac = 0;
    this.fpsZaman = 0;
    this.fpsGoster = 60;

    // Oyun durumu
    this.durum = this.sifirDurum();

    // Girdi
    this.tuslar = {};

    // Çizim objeleri
    this.arabalar = [];
    this.npcler = [];
    this.bulutlar = [];
    this.yildizlar = [];
    this.yagmurDamla = [];

    // Event emitter için
    this.olaylar = {};
  }

  // ============================================================
  // 1. SIFIR DURUM
  // ============================================================
  Oyun.prototype.sifirDurum = function () {
    return {
      // Pozisyon
      x: 400,
      y: 400,
      yon: 1,           // 1 = sağ, -1 = sol
      yurumeAnim: 0,
      // Zaman
      gun: 1,
      zaman: 0,         // gün içi saniye
      // Stat
      para: 1000,
      moral: 60,
      aclik: 100,
      // İstatistik
      toplamOdenen: 0,
      reddedilen: 0,
      marketHarcama: 0,
      // Envanter
      envanter: {},
      // Mevcut vergi
      aktifVergi: null,
      sonVergiIndex: 0,
      vergiSayaci: 0,
      // Ayarlar
      meslek: "memur",
      // NPC mesaj
      konusmaMetin: "",
      konusmaZaman: 0,
      // Diğer
      uyuduMu: false,
      marketteMi: false,
      diyalogAcik: false,
    };
  };

  // ============================================================
  // 2. BAŞLAT
  // ============================================================
  Oyun.prototype.baslat = function (secenekler) {
    secenekler = secenekler || {};

    // Canvas bul
    this.canvas = document.getElementById("oyun-canvas");
    if (!this.canvas) {
      console.error("❌ Canvas bulunamadı (#oyun-canvas)");
      return;
    }
    this.ctx = this.canvas.getContext("2d");

    // Boyutları ayarla
    if (secenekler.genislik) this.genislik = secenekler.genislik;
    if (secenekler.yukseklik) this.yukseklik = secenekler.yukseklik;

    this.canvas.width = this.genislik;
    this.canvas.height = this.yukseklik;

    // Süre (gün uzunluğu)
    if (secenekler.gunSaniye) this.gunSaniye = secenekler.gunSaniye;

    // Meslek uygula
    if (secenekler.meslek) this.meslekUygula(secenekler.meslek);

    // Çizim objelerini oluştur
    this.arabalariOlustur();
    this.npcleriOlustur();
    this.bulutlariOlustur();
    this.yildizlariOlustur();
    this.yagmurOlustur();

    // Olayları bağla
    this.olaylariBagla();

    // Aktif yap
    this.aktif = true;
    this.duraklatildi = false;
    this.oyunBitti = false;

    // Döngüyü başlat
    this.sonZaman = performance.now() / 1000;
    this.dongu();

    console.log("🎮 Oyun başlatıldı");
  };

  // ============================================================
  // 3. MESLEK UYGULA
  // ============================================================
  Oyun.prototype.meslekUygula = function (meslekId) {
    const meslek = window.VERGI.meslekBul(meslekId);
    if (!meslek) return;

    this.durum.meslek = meslekId;
    this.durum.para = meslek.para;
    this.durum.moral = meslek.moral;
    this.durum.aclik = meslek.aclik;
  };

  // ============================================================
  // 4. OLAYLARI BAĞLA
  // ============================================================
  Oyun.prototype.olaylariBagla = function () {
    const self = this;

    // Klavye aşağı
    this._keydownHandler = function (e) {
      self.tuslar[e.key.toLowerCase()] = true;
      self.tuslar[e.key] = true;

      // Özel tuşlar
      if (e.key === "Escape" || e.key === "Esc") {
        self.menuToggle();
      }
      if (e.key === "Tab") {
        e.preventDefault();
        self.envanterToggle();
      }
      if (e.key === "e" || e.key === "E") {
        self.etkilesim();
      }
      if (e.key === "Enter" && !self.durum.diyalogAcik) {
        const aktif = document.activeElement;
        if (!aktif || aktif.tagName !== "INPUT") {
          // Sohbet input focus
        }
      }

      // Yön tuşları prevent
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].indexOf(e.key) !== -1) {
        e.preventDefault();
      }
    };

    // Klavye yukarı
    this._keyupHandler = function (e) {
      self.tuslar[e.key.toLowerCase()] = false;
      self.tuslar[e.key] = false;
    };

    // Pencere blur
    this._blurHandler = function () {
      self.tuslar = {};
    };

    document.addEventListener("keydown", this._keydownHandler);
    document.addEventListener("keyup", this._keyupHandler);
    window.addEventListener("blur", this._blurHandler);
  };

  // ============================================================
  // 5. OLAYLARI KALDIR
  // ============================================================
  Oyun.prototype.olaylariKaldir = function () {
    if (this._keydownHandler) {
      document.removeEventListener("keydown", this._keydownHandler);
    }
    if (this._keyupHandler) {
      document.removeEventListener("keyup", this._keyupHandler);
    }
    if (this._blurHandler) {
      window.removeEventListener("blur", this._blurHandler);
    }
  };

  // ============================================================
  // 6. ÇİZİM OBJELERİ OLUŞTUR
  // ============================================================
  Oyun.prototype.arabalariOlustur = function () {
    this.arabalar = [
      { x: -80, y: 320, hiz: 80, renk: "#e63946", yon: 1 },
      { x: 900, y: 350, hiz: 100, renk: "#457b9d", yon: -1 },
      { x: -100, y: 330, hiz: 60, renk: "#f4a261", yon: 1 },
    ];
  };

  Oyun.prototype.npcleriOlustur = function () {
    const renkler = ["#6a4c93", "#9a4c6a", "#4c8a9a", "#5c8a4c", "#8a7a4c"];
    this.npcler = [];
    for (let i = 0; i < 3; i++) {
      this.npcler.push({
        x: -20 - i * 200,
        y: 400 + Math.random() * 30,
        hiz: 30 + Math.random() * 40,
        renk: renkler[Math.floor(Math.random() * renkler.length)],
        yurumeAnim: 0,
      });
    }
  };

  Oyun.prototype.bulutlariOlustur = function () {
    this.bulutlar = [];
    for (let i = 0; i < 5; i++) {
      this.bulutlar.push({
        x: Math.random() * 900,
        y: 20 + Math.random() * 80,
        hiz: 8 + Math.random() * 12,
        boyut: 1 + Math.random() * 0.5,
      });
    }
  };

  Oyun.prototype.yildizlariOlustur = function () {
    this.yildizlar = [];
    for (let i = 0; i < 40; i++) {
      this.yildizlar.push({
        x: Math.random() * 800,
        y: Math.random() * 120,
        boyut: 1 + Math.random() * 2,
        parlaklik: Math.random(),
      });
    }
  };

  Oyun.prototype.yagmurOlustur = function () {
    this.yagmurDamla = [];
    for (let i = 0; i < 60; i++) {
      this.yagmurDamla.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        hiz: 400 + Math.random() * 300,
        uzunluk: 8 + Math.random() * 10,
      });
    }
  };

  // ============================================================
  // 7. ANA DÖNGÜ
  // ============================================================
  Oyun.prototype.dongu = function () {
    if (!this.aktif) return;

    const simdi = performance.now() / 1000;
    const dt = Math.min(0.1, simdi - this.sonZaman);
    this.sonZaman = simdi;
    this.deltaTime = dt;

    // FPS hesapla
    this.fpsSayac++;
    this.fpsZaman += dt;
    if (this.fpsZaman >= 1) {
      this.fpsGoster = this.fpsSayac;
      this.fpsSayac = 0;
      this.fpsZaman = 0;
      this.fpsGuncelle();
    }

    // Duraklatılmadıysa güncelle
    if (!this.duraklatildi && !this.oyunBitti) {
      this.guncelle(dt);
    }

    // Her zaman çiz
    this.ciz();

    requestAnimationFrame(this.dongu.bind(this));
  };

  // ============================================================
  // 8. FPS GÖSTERGE GÜNCELLE
  // ============================================================
  Oyun.prototype.fpsGuncelle = function () {
    const el = document.getElementById("fps-deger");
    if (el) {
      el.textContent = this.fpsGoster;
      const kap = el.parentElement;
      if (kap) {
        kap.classList.remove("dusuk", "orta");
        if (this.fpsGoster < 30) kap.classList.add("dusuk");
        else if (this.fpsGoster < 50) kap.classList.add("orta");
      }
    }
  };

  // ============================================================
  // 9. ANA GÜNCELLEME
  // ============================================================
  Oyun.prototype.guncelle = function (dt) {
    // Hareket
    this.hareketGuncelle(dt);

    // Zaman
    this.zamanGuncelle(dt);

    // Açlık
    this.aclikGuncelle(dt);

    // Arabaları güncelle
    this.arabalariGuncelle(dt);

    // NPC'leri güncelle
    this.npcleriGuncelle(dt);

    // Bulutları güncelle
    this.bulutlariGuncelle(dt);

    // Konuşma sayacı
    if (this.durum.konusmaZaman > 0) {
      this.durum.konusmaZaman -= dt;
    }

    // HUD güncelle
    this.hudGuncelle();
  };

  // ============================================================
  // 10. HAREKET
  // ============================================================
  Oyun.prototype.hareketGuncelle = function (dt) {
    // Vergi kartı açıkken veya diyalog açıkken hareket etme
    if (this.durum.aktifVergi || this.durum.diyalogAcik) return;

    // Aktif input alanı varsa hareket etme
    const aktif = document.activeElement;
    if (aktif && aktif.tagName === "INPUT") return;
    if (aktif && aktif.tagName === "TEXTAREA") return;

    const d = this.durum;
    let nx = d.x;
    let ny = d.y;
    let hareketVar = false;

    const hiz = window.VERGI.SABITLER.HAREKET_HIZI;

    // WASD + oklar
    if (this.tuslar["w"] || this.tuslar["W"] || this.tuslar["ArrowUp"]) {
      ny -= hiz;
      hareketVar = true;
    }
    if (this.tuslar["s"] || this.tuslar["S"] || this.tuslar["ArrowDown"]) {
      ny += hiz;
      hareketVar = true;
    }
    if (this.tuslar["a"] || this.tuslar["A"] || this.tuslar["ArrowLeft"]) {
      nx -= hiz;
      d.yon = -1;
      hareketVar = true;
    }
    if (this.tuslar["d"] || this.tuslar["D"] || this.tuslar["ArrowRight"]) {
      nx += hiz;
      d.yon = 1;
      hareketVar = true;
    }

    // Sınırlar
    nx = Math.max(20, Math.min(this.genislik - 20, nx));
    ny = Math.max(180, Math.min(this.yukseklik - 20, ny));

    // Eğer değiştiyse uygula
    if (hareketVar) {
      d.x = nx;
      d.y = ny;
      d.yurumeAnim += dt * 12;
    } else {
      d.yurumeAnim = 0;
    }

    // Adım sesi
    if (hareketVar && Math.floor(d.yurumeAnim) % 4 === 0 && Math.random() < 0.15) {
      if (window.VERGI.Ses && window.VERGI.Ses.adimSesi) {
        window.VERGI.Ses.adimSesi();
      }
    }
  };

  // ============================================================
  // 11. ZAMAN
  // ============================================================
  Oyun.prototype.zamanGuncelle = function (dt) {
    const d = this.durum;
    d.zaman += dt;

    // Yeni vergi gelme (her gün 2 kez)
    const gunOrani = d.zaman / this.gunSaniye;
    const suAnkiVergi = Math.floor(gunOrani * 2);

    if (suAnkiVergi > d.sonVergiIndex && suAnkiVergi <= 2 && !d.aktifVergi) {
      d.sonVergiIndex = suAnkiVergi;
      this.vergiGoster();
    }

    // Gün bitti mi?
    if (d.zaman >= this.gunSaniye) {
      // Uyumadıysa ceza
      d.moral -= 20;
      d.gun++;
      d.zaman = 0;
      d.sonVergiIndex = 0;

      if (d.moral <= 0 || d.gun > window.VERGI.SABITLER.MAX_GUN) {
        this.oyunBitir("idam");
      } else {
        this.bildirimGoster("⚠️ Uyumadın! Moral -20", "kotu");
      }
    }
  };

  // ============================================================
  // 12. AÇLIK
  // ============================================================
  Oyun.prototype.aclikGuncelle = function (dt) {
    const d = this.durum;
    d.aclik -= window.VERGI.SABITLER.ACIKMA_HIZI * dt;

    if (d.aclik <= 0) {
      d.aclik = 0;
      d.moral -= 5 * dt;

      if (d.moral <= 0) {
        d.moral = 0;
        this.oyunBitir("aclik");
      }
    }

    // Açlık uyarı
    if (d.aclik < 30 && !this._aclikUyariGosterildi) {
      this._aclikUyariGosterildi = true;
      const uyari = document.getElementById("aclikUyari");
      if (uyari) uyari.classList.remove("gizli");
    } else if (d.aclik >= 30) {
      this._aclikUyariGosterildi = false;
    }
  };

  // ============================================================
  // 13. ARABALAR
  // ============================================================
  Oyun.prototype.arabalariGuncelle = function (dt) {
    for (let i = 0; i < this.arabalar.length; i++) {
      const a = this.arabalar[i];
      a.x += a.hiz * a.yon * dt;

      if (a.yon > 0 && a.x > this.genislik + 100) {
        a.x = -100;
      } else if (a.yon < 0 && a.x < -100) {
        a.x = this.genislik + 100;
      }
    }
  };

  // ============================================================
  // 14. NPC'LER
  // ============================================================
  Oyun.prototype.npcleriGuncelle = function (dt) {
    for (let i = 0; i < this.npcler.length; i++) {
      const n = this.npcler[i];
      n.x += n.hiz * dt;
      n.yurumeAnim += dt * 8;

      if (n.x > this.genislik + 40) {
        n.x = -40 - Math.random() * 200;
        n.y = 400 + Math.random() * 30;
      }
    }
  };

  // ============================================================
  // 15. BULUTLAR
  // ============================================================
  Oyun.prototype.bulutlariGuncelle = function (dt) {
    for (let i = 0; i < this.bulutlar.length; i++) {
      const b = this.bulutlar[i];
      b.x += b.hiz * dt;
      if (b.x > this.genislik + 80) {
        b.x = -80;
        b.y = 20 + Math.random() * 80;
      }
    }
  };

  // ============================================================
  // 16. ZAMAN FAZI
  // ============================================================
  Oyun.prototype.faz = function () {
    const r = this.durum.zaman / this.gunSaniye;
    if (r < 0.65) return "gunduz";
    if (r < 0.78) return "gunbatimi";
    return "gece";
  };

  // ============================================================
  // 17. ANA ÇİZİM
  // ============================================================
  Oyun.prototype.ciz = function () {
    const ctx = this.ctx;
    if (!ctx) return;

    // Ekranı temizle
    ctx.clearRect(0, 0, this.genislik, this.yukseklik);

    // Arkaplan
    this.gokyuzuCiz();

    // Şehir silüeti
    this.sehirCiz();

    // Yol
    this.yolCiz();

    // Zemin
    this.zeminCiz();

    // Ağaçlar
    this.agacCiz(250, 220);
    this.agacCiz(420, 240);
    this.agacCiz(600, 250);
    this.agacCiz(750, 230);

    // Market
    this.marketCiz();

    // Ev + yatak
    this.evCiz();
    this.yatakCiz();

    // Arabalar
    this.arabalariCiz();

    // NPC'ler
    this.npcleriCiz();

    // Karakter
    this.karakterCiz();

    // Yağmur
    if (this.faz() === "gece" || this.durum.moral < 20) {
      this.yagmurCiz();
    }

    // Gece overlay
    this.geceOverlayCiz();

    // Konuşma balonu
    this.konusmaBalonuCiz();

    // İpucu
    this.ipucuGuncelle();
  };

  // ============================================================
  // 18. GÖKYÜZÜ ÇİZ
  // ============================================================
  Oyun.prototype.gokyuzuCiz = function () {
    const ctx = this.ctx;
    const f = this.faz();

    let renk1, renk2;
    if (f === "gunduz") {
      renk1 = "#6ec6ff";
      renk2 = "#b8e2ff";
    } else if (f === "gunbatimi") {
      renk1 = "#ff9d5c";
      renk2 = "#ffb88c";
    } else {
      renk1 = "#0d1b3d";
      renk2 = "#1a2a4a";
    }

    // Gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 180);
    grad.addColorStop(0, renk1);
    grad.addColorStop(1, renk2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.genislik, 180);

    // Yıldızlar (gece)
    if (f === "gece") {
      for (let i = 0; i < this.yildizlar.length; i++) {
        const y = this.yildizlar[i];
        const parlaklik = 0.3 + Math.sin(y.parlaklik + performance.now() / 800) * 0.4;
        ctx.fillStyle = "rgba(255,255,255," + Math.max(0, parlaklik) + ")";
        ctx.fillRect(y.x, y.y, y.boyut, y.boyut);
      }
    }

    // Güneş/Ay
    if (f === "gece") {
      // Ay
      ctx.fillStyle = "#f0f0f0";
      ctx.beginPath();
      ctx.arc(700, 60, 22, 0, Math.PI * 2);
      ctx.fill();
      // Ay gölgesi (hilal)
      ctx.fillStyle = renk1;
      ctx.beginPath();
      ctx.arc(710, 55, 20, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Güneş
      const gunesRenk = f === "gunbatimi" ? "#ff8c00" : "#ffd93b";
      ctx.fillStyle = gunesRenk;
      ctx.beginPath();
      ctx.arc(700, 60, 26, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = f === "gunbatimi" ? "#ffb84d" : "#fff5b0";
      ctx.beginPath();
      ctx.arc(700, 60, 18, 0, Math.PI * 2);
      ctx.fill();
    }

    // Bulutlar
    for (let i = 0; i < this.bulutlar.length; i++) {
      this.bulutCiz(this.bulutlar[i]);
    }
  };

  // ============================================================
  // 19. BULUT ÇİZ
  // ============================================================
  Oyun.prototype.bulutCiz = function (b) {
    const ctx = this.ctx;
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.beginPath();
    ctx.arc(b.x, b.y, 20 * b.boyut, 0, Math.PI * 2);
    ctx.arc(b.x + 20 * b.boyut, b.y - 5, 25 * b.boyut, 0, Math.PI * 2);
    ctx.arc(b.x + 45 * b.boyut, b.y, 20 * b.boyut, 0, Math.PI * 2);
    ctx.fill();
  };

  // ============================================================
  // 20. ŞEHİR ÇİZ
  // ============================================================
  Oyun.prototype.sehirCiz = function () {
    const ctx = this.ctx;
    const f = this.faz();

    // Bina renkleri
    const binaRengi = f === "gece" ? "#1a1a2e" : "#2a2a4a";

    const binalar = [
      { x: 20, genislik: 60, yukseklik: 120 },
      { x: 90, genislik: 50, yukseklik: 90 },
      { x: 150, genislik: 70, yukseklik: 140 },
      { x: 520, genislik: 65, yukseklik: 110 },
      { x: 600, genislik: 55, yukseklik: 95 },
      { x: 670, genislik: 60, yukseklik: 130 },
      { x: 740, genislik: 50, yukseklik: 100 },
    ];

    for (let i = 0; i < binalar.length; i++) {
      const b = binalar[i];

      // Bina gövdesi
      ctx.fillStyle = binaRengi;
      ctx.fillRect(b.x, 180 - b.yukseklik, b.genislik, b.yukseklik);

      // Kenarlık
      ctx.strokeStyle = "#0f0f1e";
      ctx.lineWidth = 2;
      ctx.strokeRect(b.x, 180 - b.yukseklik, b.genislik, b.yukseklik);

      // Pencereler
      const gece = f === "gece";
      for (let y = 180 - b.yukseklik + 10; y < 170; y += 18) {
        for (let x = b.x + 8; x < b.x + b.genislik - 8; x += 15) {
          // Rastgele yanan pencere
          const yan = gece ? Math.random() > 0.4 : Math.random() > 0.7;
          ctx.fillStyle = yan ? "#feca57" : (gece ? "#2a2a3a" : "#4a5a7a");
          ctx.fillRect(x, y, 8, 10);
        }
      }
    }
  };

  // ============================================================
  // 21. YOL ÇİZ
  // ============================================================
  Oyun.prototype.yolCiz = function () {
    const ctx = this.ctx;

    // Yol
    ctx.fillStyle = "#2a2a2a";
    ctx.fillRect(0, 300, this.genislik, 90);

    // Yol kenarı
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 300, this.genislik, 4);
    ctx.fillRect(0, 386, this.genislik, 4);

    // Şerit çizgileri (kayan)
    ctx.fillStyle = "#ffd700";
    const kaydir = (performance.now() / 20) % 60;
    for (let x = -60 + kaydir; x < this.genislik; x += 60) {
      ctx.fillRect(x, 342, 30, 4);
    }
  };

  // ============================================================
  // 22. ZEMİN ÇİZ
  // ============================================================
  Oyun.prototype.zeminCiz = function () {
    const ctx = this.ctx;
    const f = this.faz();

    // Üst çimen (yol öncesi)
    ctx.fillStyle = f === "gece" ? "#0f2410" : "#4a7c24";
    ctx.fillRect(0, 180, this.genislik, 120);

    // Alt çimen (yol sonrası)
    ctx.fillRect(0, 390, this.genislik, this.yukseklik - 390);

    // Çimen kenar
    ctx.fillStyle = f === "gece" ? "#1a3a1a" : "#5c9e2c";
    ctx.fillRect(0, 180, this.genislik, 4);
    ctx.fillRect(0, 390, this.genislik, 4);
  };

  // ============================================================
  // 23. AĞAÇ ÇİZ
  // ============================================================
  Oyun.prototype.agacCiz = function (x, y) {
    const ctx = this.ctx;

    // Gölge
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.ellipse(x, y + 32, 26, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Gövde
    ctx.fillStyle = "#5C3317";
    ctx.fillRect(x - 7, y, 14, 36);
    ctx.strokeStyle = "#2e1c0c";
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 7, y, 14, 36);

    // Yapraklar
    ctx.fillStyle = "#2e7d32";
    ctx.beginPath();
    ctx.arc(x, y - 10, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#1a3a1a";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#4caf50";
    ctx.beginPath();
    ctx.arc(x - 12, y - 6, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + 12, y - 14, 14, 0, Math.PI * 2);
    ctx.fill();
  };

  // ============================================================
  // 24. MARKET ÇİZ
  // ============================================================
  Oyun.prototype.marketCiz = function () {
    const ctx = this.ctx;
    const m = this.marketKonum();

    // Bina
    ctx.fillStyle = "#4a6fa5";
    ctx.fillRect(m.x, m.y + 40, m.w, m.h - 40);
    ctx.strokeStyle = "#1e3a5f";
    ctx.lineWidth = 3;
    ctx.strokeRect(m.x, m.y + 40, m.w, m.h - 40);

    // Tabela
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(m.x, m.y, m.w, 40);
    ctx.strokeStyle = "#6a1a10";
    ctx.strokeRect(m.x, m.y, m.w, 40);

    // Market yazısı
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px monospace";
    ctx.textAlign = "center";
    ctx.fillText("🛒 MARKET", m.x + m.w / 2, m.y + 28);

    // Kapı
    ctx.fillStyle = "#3a1f0a";
    ctx.fillRect(m.x + m.w / 2 - 15, m.y + m.h - 30, 30, 30);
    ctx.strokeStyle = "#1a0a00";
    ctx.strokeRect(m.x + m.w / 2 - 15, m.y + m.h - 30, 30, 30);

    // Pencere
    const gece = this.faz() === "gece";
    ctx.fillStyle = gece ? "#feca57" : "#a5dcff";
    ctx.fillRect(m.x + 15, m.y + 55, 25, 25);
    ctx.strokeStyle = "#1e3a5f";
    ctx.strokeRect(m.x + 15, m.y + 55, 25, 25);
  };

  // ============================================================
  // 25. MARKET KONUM
  // ============================================================
  Oyun.prototype.marketKonum = function () {
    return { x: 550, y: 200, w: 100, h: 100 };
  };

  // ============================================================
  // 26. EV ÇİZ
  // ============================================================
  Oyun.prototype.evCiz = function () {
    const ctx = this.ctx;
    const ev = this.evKonum();
    const gece = this.faz() === "gece";

    // Gövde
    ctx.fillStyle = "#6B3410";
    ctx.fillRect(ev.x, ev.y + 40, ev.w, ev.h - 40);
    ctx.strokeStyle = "#1a0a00";
    ctx.lineWidth = 3;
    ctx.strokeRect(ev.x, ev.y + 40, ev.w, ev.h - 40);

    // Çatı
    ctx.fillStyle = "#8b1a1a";
    ctx.beginPath();
    ctx.moveTo(ev.x - 10, ev.y + 40);
    ctx.lineTo(ev.x + ev.w / 2, ev.y);
    ctx.lineTo(ev.x + ev.w + 10, ev.y + 40);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#4a0000";
    ctx.stroke();

    // Kapı
    ctx.fillStyle = "#3a1f0a";
    ctx.fillRect(ev.x + ev.w / 2 - 18, ev.y + ev.h - 45, 36, 45);
    ctx.strokeStyle = "#1a0a00";
    ctx.strokeRect(ev.x + ev.w / 2 - 18, ev.y + ev.h - 45, 36, 45);

    // Pencere (gece yanar)
    ctx.fillStyle = gece ? "#feca57" : "#a5dcff";
    ctx.fillRect(ev.x + 15, ev.y + 60, 25, 25);
    ctx.strokeStyle = "#1a0a00";
    ctx.strokeRect(ev.x + 15, ev.y + 60, 25, 25);

    // Pencere çarpı
    ctx.beginPath();
    ctx.moveTo(ev.x + 27, ev.y + 60);
    ctx.lineTo(ev.x + 27, ev.y + 85);
    ctx.moveTo(ev.x + 15, ev.y + 72);
    ctx.lineTo(ev.x + 40, ev.y + 72);
    ctx.stroke();
  };

  // ============================================================
  // 27. EV KONUM
  // ============================================================
  Oyun.prototype.evKonum = function () {
    return { x: 320, y: 200, w: 100, h: 100 };
  };

  // ============================================================
  // 28. YATAK ÇİZ
  // ============================================================
  Oyun.prototype.yatakCiz = function () {
    const ctx = this.ctx;
    const y = this.yatakKonum();

    // Gövde
    ctx.fillStyle = "#fff";
    ctx.fillRect(y.x, y.y, y.w, y.h);
    ctx.strokeStyle = "#4a2a2a";
    ctx.lineWidth = 3;
    ctx.strokeRect(y.x, y.y, y.w, y.h);

    // Yorgan
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(y.x, y.y + 12, y.w, y.h - 12);
    ctx.strokeRect(y.x, y.y + 12, y.w, y.h - 12);

    // Yastık
    ctx.fillStyle = "#feca57";
    ctx.fillRect(y.x + 4, y.y + 3, y.w - 8, 8);
  };

  // ============================================================
  // 29. YATAK KONUM
  // ============================================================
  Oyun.prototype.yatakKonum = function () {
    const ev = this.evKonum();
    return { x: ev.x + 25, y: ev.y + 55, w: 50, h: 30 };
  };

  // ============================================================
  // 30. ARABALARI ÇİZ
  // ============================================================
  Oyun.prototype.arabalariCiz = function () {
    const ctx = this.ctx;
    for (let i = 0; i < this.arabalar.length; i++) {
      const a = this.arabalar[i];

      // Gövde
      ctx.fillStyle = a.renk;
      ctx.fillRect(a.x, a.y, 40, 22);
      ctx.strokeStyle = "#1a1a1a";
      ctx.lineWidth = 2;
      ctx.strokeRect(a.x, a.y, 40, 22);

      // Üst (kabin)
      ctx.fillStyle = "#a8a8a8";
      ctx.fillRect(a.x + 8, a.y - 6, 24, 8);
      ctx.strokeStyle = "#1a1a1a";
      ctx.strokeRect(a.x + 8, a.y - 6, 24, 8);

      // Pencere
      ctx.fillStyle = "#4a6fa5";
      ctx.fillRect(a.x + 10, a.y - 5, 8, 6);
      ctx.fillRect(a.x + 22, a.y - 5, 8, 6);

      // Tekerlekler
      ctx.fillStyle = "#1a1a1a";
      ctx.beginPath();
      ctx.arc(a.x + 8, a.y + 22, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(a.x + 32, a.y + 22, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // ============================================================
  // 31. NPC'LERİ ÇİZ
  // ============================================================
  Oyun.prototype.npcleriCiz = function () {
    const ctx = this.ctx;
    for (let i = 0; i < this.npcler.length; i++) {
      const n = this.npcler[i];
      this.npcCiz(n);
    }
  };

  Oyun.prototype.npcCiz = function (n) {
    const ctx = this.ctx;
    const yuru = Math.sin(n.yurumeAnim) * 2;

    // Gölge
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.ellipse(n.x, n.y + 12, 10, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bacaklar
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(n.x - 6, n.y + 2 + yuru, 5, 10);
    ctx.fillRect(n.x + 1, n.y + 2 - yuru, 5, 10);

    // Gövde
    ctx.fillStyle = n.renk;
    ctx.fillRect(n.x - 8, n.y - 10, 16, 14);
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 1;
    ctx.strokeRect(n.x - 8, n.y - 10, 16, 14);

    // Kafa
    ctx.fillStyle = "#f4c89c";
    ctx.fillRect(n.x - 7, n.y - 24, 14, 14);
    ctx.strokeStyle = "#2e1c0c";
    ctx.strokeRect(n.x - 7, n.y - 24, 14, 14);

    // Saç
    ctx.fillStyle = "#2e1c0c";
    ctx.fillRect(n.x - 7, n.y - 26, 14, 5);

    // Gözler
    ctx.fillStyle = "#000";
    ctx.fillRect(n.x - 4, n.y - 18, 2, 2);
    ctx.fillRect(n.x + 2, n.y - 18, 2, 2);
  };

  // ============================================================
  // 32. KARAKTER ÇİZ
  // ============================================================
  Oyun.prototype.karakterCiz = function () {
    const ctx = this.ctx;
    const d = this.durum;
    const x = d.x;
    const y = d.y;
    const yuru = Math.sin(d.yurumeAnim) * 3;
    const yon = d.yon;
    const f = this.faz();
    const gece = f === "gece";

    // Gölge
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath();
    ctx.ellipse(x, y + 24, 16, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bacaklar (yürüme animasyonu)
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(x - 10, y + 12 + yuru, 8, 14);
    ctx.fillRect(x + 2, y + 12 - yuru, 8, 14);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 10, y + 12 + yuru, 8, 14);
    ctx.strokeRect(x + 2, y + 12 - yuru, 8, 14);

    // Ayakkabılar
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(x - 12, y + 24 + yuru, 12, 5);
    ctx.fillRect(x, y + 24 - yuru, 12, 5);

    // Gövde
    const gomlekRenk = gece ? "#3a5a8f" : "#4a6fa5";
    ctx.fillStyle = gomlekRenk;
    ctx.fillRect(x - 13, y - 14, 26, 28);
    ctx.strokeStyle = "#000";
    ctx.strokeRect(x - 13, y - 14, 26, 28);

    // Yaka
    ctx.fillStyle = "#2e4a6f";
    ctx.fillRect(x - 5, y - 14, 10, 6);

    // Kemer
    ctx.fillStyle = "#2e1c0c";
    ctx.fillRect(x - 13, y + 8, 26, 5);

    // Kemer tokası
    ctx.fillStyle = "#feca57";
    ctx.fillRect(x - 2, y + 9, 4, 3);

    // Kollar (sallama)
    const kolSal = Math.sin(d.yurumeAnim) * 3;
    ctx.fillStyle = "#f4c89c";
    ctx.fillRect(x - 18, y - 12 + kolSal, 6, 20);
    ctx.fillRect(x + 12, y - 12 - kolSal, 6, 20);
    ctx.strokeStyle = "#2e1c0c";
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 18, y - 12 + kolSal, 6, 20);
    ctx.strokeRect(x + 12, y - 12 - kolSal, 6, 20);

    // Kafa
    ctx.fillStyle = "#f4c89c";
    ctx.fillRect(x - 11, y - 34, 22, 22);
    ctx.strokeStyle = "#2e1c0c";
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 11, y - 34, 22, 22);

    // Saç
    ctx.fillStyle = "#2e1c0c";
    ctx.fillRect(x - 11, y - 36, 22, 8);

    // Gözler (yön)
    const gozYon = yon > 0 ? 2 : -2;
    const gozAcilma = 3 + Math.sin(performance.now() / 3000) > 0 ? 4 : 2;

    ctx.fillStyle = "#fff";
    ctx.fillRect(x - 6 + gozYon, y - 26, 4, gozAcilma);
    ctx.fillRect(x + 2 + gozYon, y - 26, 4, gozAcilma);

    ctx.fillStyle = "#000";
    ctx.fillRect(x - 5 + gozYon, y - 25, 2, 2);
    ctx.fillRect(x + 3 + gozYon, y - 25, 2, 2);

    // Ağız (moral + açlık durumuna göre)
    ctx.fillStyle = "#2e1c0c";
    const mutlu = d.moral >= 60 && d.aclik > 30;
    const uzgun = d.moral < 30 || d.aclik < 20;

    if (mutlu) {
      // Gülümseme
      ctx.fillRect(x - 4, y - 16, 8, 2);
      ctx.fillRect(x - 5, y - 17, 2, 2);
      ctx.fillRect(x + 3, y - 17, 2, 2);
    } else if (uzgun) {
      // Üzgün
      ctx.fillRect(x - 3, y - 15, 6, 2);
      ctx.fillRect(x - 4, y - 16, 2, 2);
      ctx.fillRect(x + 2, y - 16, 2, 2);
    } else {
      // Düz
      ctx.fillRect(x - 3, y - 16, 6, 2);
    }

    // Açlık göstergesi (baş üstü)
    if (d.aclik < 40) {
      ctx.font = "bold 16px monospace";
      ctx.textAlign = "center";
      ctx.fillText(d.aclik < 20 ? "🍞❗" : "🍞", x, y - 50);
    }

    // İsim etiketi
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "center";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.strokeText("SEN", x, y - 60);
    ctx.fillStyle = "#feca57";
    ctx.fillText("SEN", x, y - 60);
  };

  // ============================================================
  // 33. YAĞMUR ÇİZ
  // ============================================================
  Oyun.prototype.yagmurCiz = function () {
    const ctx = this.ctx;
    ctx.strokeStyle = "rgba(138, 180, 212, 0.5)";
    ctx.lineWidth = 1;

    const dt = this.deltaTime;

    for (let i = 0; i < this.yagmurDamla.length; i++) {
      const d = this.yagmurDamla[i];
      d.y += d.hiz * dt;

      if (d.y > this.yukseklik) {
        d.y = -20;
        d.x = Math.random() * this.genislik;
      }

      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x, d.y + d.uzunluk);
      ctx.stroke();
    }
  };

  // ============================================================
  // 34. GECE OVERLAY
  // ============================================================
  Oyun.prototype.geceOverlayCiz = function () {
    const ctx = this.ctx;
    const f = this.faz();

    if (f === "gece") {
      ctx.fillStyle = "rgba(0, 0, 50, 0.45)";
      ctx.fillRect(0, 0, this.genislik, this.yukseklik);
    } else if (f === "gunbatimi") {
      ctx.fillStyle = "rgba(255, 100, 50, 0.15)";
      ctx.fillRect(0, 0, this.genislik, this.yukseklik);
    }
  };

  // ============================================================
  // 35. KONUŞMA BALONU ÇİZ
  // ============================================================
  Oyun.prototype.konusmaBalonuCiz = function () {
    if (!this.durum.konusmaMetin || this.durum.konusmaZaman <= 0) return;

    const ctx = this.ctx;
    const x = this.durum.x;
    const y = this.durum.y;
    const metin = this.durum.konusmaMetin;

    ctx.font = "bold 12px monospace";
    const genislik = ctx.measureText(metin).width + 20;
    const yukseklik = 24;

    const bx = x - genislik / 2;
    const by = y - 90;

    // Balon
    ctx.fillStyle = "#fff";
    ctx.fillRect(bx, by, genislik, yukseklik);
    ctx.strokeStyle = "#1a1a2e";
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, genislik, yukseklik);

    // Ok
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(x - 6, by + yukseklik);
    ctx.lineTo(x, by + yukseklik + 8);
    ctx.lineTo(x + 6, by + yukseklik);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#1a1a2e";
    ctx.stroke();

    // Ok içini kapat
    ctx.fillStyle = "#fff";
    ctx.fillRect(x - 6, by + yukseklik - 2, 12, 4);

    // Metin
    ctx.fillStyle = "#1a1a2e";
    ctx.textAlign = "center";
    ctx.font = "bold 12px monospace";
    ctx.fillText(metin, x, by + 16);
  };

  // ============================================================
  // 36. İPUCU GÜNCELLE
  // ============================================================
  Oyun.prototype.ipucuGuncelle = function () {
    const el = document.getElementById("oyun-ipucu");
    if (!el) return;

    const d = this.durum;
    const f = this.faz();

    let ipucuMetin = null;

    // Yatakta mı?
    const y = this.yatakKonum();
    const dxY = d.x - (y.x + y.w / 2);
    const dyY = d.y - (y.y + y.h / 2);
    const yatakYakin = Math.sqrt(dxY * dxY + dyY * dyY) < 60;

    // Markette mi?
    const m = this.marketKonum();
    const dxM = d.x - (m.x + m.w / 2);
    const dyM = d.y - (m.y + m.h / 2);
    const marketYakin = Math.sqrt(dxM * dxM + dyM * dyM) < 70;

    if (marketYakin) {
      ipucuMetin = "🛒 <strong>E</strong> — Market";
    } else if (yatakYakin && f === "gece") {
      ipucuMetin = "🛏️ <strong>E</strong> — Yatakta uyu";
    } else if (yatakYakin) {
      ipucuMetin = "☀️ Gece olunca uyuyabilirsin";
    }

    if (ipucuMetin) {
      el.innerHTML = ipucuMetin;
      el.classList.remove("gizli");
    } else {
      el.classList.add("gizli");
    }
  };

  // ============================================================
  // 37. HUD GÜNCELLE
  // ============================================================
  Oyun.prototype.hudGuncelle = function () {
    const d = this.durum;

    // Gün
    const elGun = document.getElementById("hud-gun");
    if (elGun) elGun.textContent = d.gun;

    // Zaman
    const elZaman = document.getElementById("hud-zaman");
    if (elZaman) {
      const kalan = Math.max(0, this.gunSaniye - d.zaman);
      elZaman.textContent = window.VERGI.zamanFormat(kalan);
    }

    // Zaman ikonu
    const elZamanIkon = document.getElementById("hud-zaman-ikon");
    if (elZamanIkon) {
      const f = this.faz();
      elZamanIkon.textContent = f === "gunduz" ? "☀️" : (f === "gunbatimi" ? "🌅" : "🌙");
    }

    // Bilgi saat
    const elBilgiSaat = document.getElementById("hud-bilgi-saat");
    if (elBilgiSaat) {
      const f = this.faz();
      elBilgiSaat.textContent = f === "gunduz" ? "☀️ Gündüz" : (f === "gunbatimi" ? "🌅 Gün Batımı" : "🌙 Gece");
    }

    // Para
    const elPara = document.getElementById("hud-para");
    if (elPara) {
      elPara.textContent = window.VERGI.sayiFormat(d.para);
      // Uyarı renkleri
      const kap = document.getElementById("hud-kutu-para");
      if (kap) {
        kap.classList.remove("tehlike", "uyari");
        if (d.para < 100) kap.classList.add("tehlike");
        else if (d.para < 300) kap.classList.add("uyari");
      }
    }

    // Açlık
    const elAclik = document.getElementById("hud-aclik");
    if (elAclik) {
      elAclik.textContent = Math.floor(d.aclik);
      const kap = document.getElementById("hud-kutu-aclik");
      if (kap) {
        kap.classList.remove("tehlike", "uyari");
        if (d.aclik < 20) kap.classList.add("tehlike");
        else if (d.aclik < 50) kap.classList.add("uyari");
      }
    }

    // Moral
    const elMoral = document.getElementById("hud-moral");
    if (elMoral) {
      elMoral.textContent = Math.floor(d.moral);
      const kap = document.getElementById("hud-kutu-moral");
      if (kap) {
        kap.classList.remove("tehlike", "uyari");
        if (d.moral < 20) kap.classList.add("tehlike");
        else if (d.moral < 50) kap.classList.add("uyari");
      }
    }

    // Moral barı
    const elMoralBar = document.getElementById("moral-bar-dolgu");
    if (elMoralBar) {
      elMoralBar.style.width = Math.max(0, Math.min(100, d.moral)) + "%";
      elMoralBar.style.backgroundPosition = Math.max(0, Math.min(100, d.moral)) + "% 0";
    }

    // Açlık barı
    const elAclikBar = document.getElementById("aclik-bar-dolgu");
    if (elAclikBar) {
      elAclikBar.style.width = Math.max(0, Math.min(100, d.aclik)) + "%";
    }
  };

  // ============================================================
  // 38. MENÜ TOGGLE (ESC)
  // ============================================================
  Oyun.prototype.menuToggle = function () {
    if (!this.aktif || this.oyunBitti) return;

    const menu = document.getElementById("oyun-menu");
    if (!menu) return;

    if (menu.classList.contains("gizli")) {
      menu.classList.remove("gizli");
      this.duraklatildi = true;

      // Bilgileri güncelle
      const mg = document.getElementById("menu-gun-bilgi");
      if (mg) mg.textContent = this.durum.gun + " / 2";
      const mp = document.getElementById("menu-para-bilgi");
      if (mp) mp.textContent = window.VERGI.paraFormat(this.durum.para);
      const mo = document.getElementById("menu-odenen-bilgi");
      if (mo) mo.textContent = window.VERGI.paraFormat(this.durum.toplamOdenen);
    } else {
      menu.classList.add("gizli");
      this.duraklatildi = false;
    }
  };

  // ============================================================
  // 39. ENVANTER TOGGLE (TAB)
  // ============================================================
  Oyun.prototype.envanterToggle = function () {
    if (!this.aktif || this.oyunBitti) return;

    const env = document.getElementById("envanter-ekrani");
    if (!env) return;

    if (env.classList.contains("gizli")) {
      env.classList.remove("gizli");
      this.duraklatildi = true;
      this.envanterRender();
    } else {
      env.classList.add("gizli");
      this.duraklatildi = false;
    }
  };

  // ============================================================
  // 40. ENVANTER RENDER
  // ============================================================
  Oyun.prototype.envanterRender = function () {
    const grid = document.getElementById("envanter-grid");
    if (!grid) return;

    grid.innerHTML = "";

    const env = this.durum.envanter;
    const anahtarlar = Object.keys(env);

    if (anahtarlar.length === 0) {
      const bos = document.createElement("div");
      bos.className = "envanter-bos";
      bos.textContent = "Envanterin boş. Market'ten bir şeyler al!";
      grid.appendChild(bos);
      return;
    }

    for (let i = 0; i < anahtarlar.length; i++) {
      const urunId = anahtarlar[i];
      const adet = env[urunId];
      const urun = window.VERGI.marketUrunuBul(urunId);
      if (!urun) continue;

      const div = document.createElement("div");
      div.className = "envanter-esya";
      div.innerHTML =
        '<div class="envanter-esya-ikon">' + urun.ikon + "</div>" +
        '<div class="envanter-esya-ad">' + urun.ad + "</div>" +
        '<div class="envanter-esya-adet">' + adet + "</div>";
      grid.appendChild(dest);
    }

    // Para güncelle
    const elPara = document.getElementById("envanter-para");
    if (elPara) elPara.textContent = window.VERGI.paraFormat(this.durum.para);
  };

  // ============================================================
  // 41. BİLDİRİM GÖSTER
  // ============================================================
  Oyun.prototype.bildirimGoster = function (metin, tur) {
    const alan = document.getElementById("bildirim-alani");
    if (!alan) return;

    const div = document.createElement("div");
    div.className = "bildirim-ogesi " + (tur || "");
    div.textContent = metin;
    alan.appendChild(div);

    setTimeout(function () {
      div.classList.add("cikis");
      setTimeout(function () {
        if (div.parentNode) div.parentNode.removeChild(div);
      }, 300);
    }, 2000);
  };

  // ============================================================
  // 42. KONUŞMA GÖSTER
  // ============================================================
  Oyun.prototype.konus = function (metin, sure) {
    sure = sure || 2;
    this.durum.konusmaMetin = metin;
    this.durum.konusmaZaman = sure;

    if (window.VERGI.Ses && window.VERGI.Ses.konusmaSesi) {
      window.VERGI.Ses.konusmaSesi();
    }
  };

  // ============================================================
  // 43. DURAKLAT / DEVAM
  // ============================================================
  Oyun.prototype.duraklat = function () {
    this.duraklatildi = true;
  };

  Oyun.prototype.devamEt = function () {
    this.duraklatildi = false;
  };

  // ============================================================
  // 44. OYUN DURDUR
  // ============================================================
  Oyun.prototype.durdur = function () {
    this.aktif = false;
    this.olaylariKaldir();
  };

  // ============================================================
  // 45. TAM SIFIRLA
  // ============================================================
  Oyun.prototype.sifirla = function (meslekId) {
    this.durum = this.sifirDurum();
    if (meslekId) this.meslekUygula(meslekId);
    this.oyunBitti = false;
    this.duraklatildi = false;
  };

  // ============================================================
  // PART 1'DE TANIMLANAN AMA PART 2'DE DETAYLANACAK METOTLAR
  // ============================================================
  // vergiGoster()         → PART 2
  // vergiKapat()          → PART 2
  // etkilesim()           → PART 2
  // marketAc()            → PART 2
  // marketUrunAl()        → PART 2
  // uyu()                 → PART 2
  // oyunBitir()           → PART 2
  // diyalogGoster()       → PART 2
  // kaydet()              → PART 2
  // yukle()               → PART 2

  // ============================================================
  // GEÇİCİ STUB'LAR (PART 2'de doldurulacak)
  // ============================================================
  Oyun.prototype.vergiGoster = function () {};
  Oyun.prototype.vergiKapat = function () {};
  Oyun.prototype.etkilesim = function () {};
  Oyun.prototype.marketAc = function () {};
  Oyun.prototype.uyu = function () {};
  Oyun.prototype.oyunBitir = function () {};

  // ============================================================
  // GLOBAL NESNE
  // ============================================================
  VERGI.Oyun = new Oyun();
  VERGI.oyun = VERGI.Oyun;

  console.log(
    "%c🎮 OYUN MODÜLÜ (PART 1) YÜKLENDİ",
    "color:#4ade80;font-size:12px;font-weight:bold;"
  );
  // ============================================================
  // 46. VERGİ GÖSTER (Modal Aç)
  // ============================================================
  Oyun.prototype.vergiGoster = function () {
    const d = this.durum;
    if (d.aktifVergi) return;

    // Rastgele vergi seç
    let vergi = window.VERGI.rastgeleVergi();

    // Meslek bonusu: emeklinin muaf olduğu vergiler
    const meslek = window.VERGI.meslekBul(d.meslek);
    if (meslek && meslek.bonus && meslek.bonus.muafiyet) {
      if (meslek.bonus.muafiyet.indexOf(vergi.id) !== -1) {
        // Muaf — tekrar seç
        vergi = window.VERGI.rastgeleVergi();
      }
    }

    // Meslek bonusu: milyarder çok vergi öder
    if (meslek && meslek.bonus && meslek.bonus.vergi_artis) {
      vergi.tutar = Math.floor(vergi.tutar * (1 + meslek.bonus.vergi_artis));
    }

    // Meslek bonusu: memur indirim
    if (meslek && meslek.bonus && meslek.bonus.vergi_indirim) {
      vergi.tutar = Math.floor(vergi.tutar * (1 - meslek.bonus.vergi_indirim));
    }

    d.aktifVergi = vergi;
    d.vergiSayaci++;

    // Modal içeriğini doldur
    const elIkon = document.getElementById("vergi-ikon");
    if (elIkon) elIkon.textContent = vergi.ikon;

    const elBaslik = document.getElementById("vergi-baslik");
    if (elBaslik) elBaslik.textContent = vergi.ad;

    const elAciklama = document.getElementById("vergi-aciklama");
    if (elAciklama) elAciklama.textContent = vergi.aciklama;

    const elTutar = document.getElementById("vergi-tutar");
    if (elTutar) elTutar.textContent = window.VERGI.paraFormat(vergi.tutar);

    // Modalı göster
    const modal = document.getElementById("vergi-kart");
    if (modal) modal.classList.remove("gizli");

    // Ses
    if (window.VERGI.Ses) {
      window.VERGI.Ses.vergiSesi();
    }

    // Karakter konuşma
    this.konus("Vergi geldi yine... 😩", 2);
  };

  // ============================================================
  // 47. VERGİ KAPAT
  // ============================================================
  Oyun.prototype.vergiKapat = function () {
    const modal = document.getElementById("vergi-kart");
    if (modal) modal.classList.add("gizli");
    this.durum.aktifVergi = null;
  };

  // ============================================================
  // 48. VERGİ ÖDE
  // ============================================================
  Oyun.prototype.vergiOde = function () {
    const d = this.durum;
    const vergi = d.aktifVergi;
    if (!vergi) return;

    const tutar = vergi.tutar;

    // Para kontrolü
    if (d.para < tutar) {
      this.bildirimGoster("💸 Yeterli paran yok!", "kotu");
      if (window.VERGI.Ses) window.VERGI.Ses.hasarSesi();
      return;
    }

    // Parayı düş
    d.para -= tutar;
    d.toplamOdenen += tutar;
    d.moral = Math.min(100, d.moral + 4);

    // Ses
    if (window.VERGI.Ses) {
      window.VERGI.Ses.paraSesi();
    }

    // Bildirim
    this.bildirimGoster("💸 " + window.VERGI.paraFormat(tutar) + " ödedin.", "iyi");

    // Karakter konuşsun
    this.konus(window.VERGI.rastgeleSec(window.VERGI.KONUSMALAR.ode), 1.5);

    // Günlüğe yaz
    if (window.VERGI.Arayuz && window.VERGI.Arayuz.gunlugeYaz) {
      window.VERGI.Arayuz.gunlugeYaz(
        "💸 " + vergi.ad + " ödendi: -" + window.VERGI.paraFormat(tutar)
      );
    }

    // Rozet kontrolü
    if (window.VERGI.Arayuz && window.VERGI.Arayuz.basarimKontrol) {
      window.VERGI.Arayuz.basarimKontrol("vergi_ode", d.vergiSayaci);
    }

    // Modalı kapat
    this.vergiKapat();

    // İflas kontrolü
    if (d.para < 0) {
      this.oyunBitir("iflas");
      return;
    }

    // Sonraki tura geç
    this.sonrakiTuraGec();
  };

  // ============================================================
  // 49. VERGİ REDDET
  // ============================================================
  Oyun.prototype.vergiReddet = function () {
    const d = this.durum;
    const vergi = d.aktifVergi;
    if (!vergi) return;

    d.reddedilen++;
    d.moral -= 12;

    // Ses
    if (window.VERGI.Ses) {
      window.VERGI.Ses.hasarSesi();
      window.VERGI.Ses.uyariSesi();
    }

    // Bildirim
    this.bildirimGoster("🙅 Reddettin! Moral -12", "kotu");

    // Karakter konuşsun (sinirli)
    this.konus(window.VERGI.rastgeleSec(window.VERGI.KONUSMALAR.reddet), 1.5);

    // Günlüğe yaz
    if (window.VERGI.Arayuz && window.VERGI.Arayuz.gunlugeYaz) {
      window.VERGI.Arayuz.gunlugeYaz(
        "🙅 " + vergi.ad + " REDDEDİLDİ! Moral -12"
      );
    }

    // Ekran sarsıntısı
    this.ekranSars();

    // Modalı kapat
    this.vergiKapat();

    // Moral kontrolü
    if (d.moral <= 0) {
      this.oyunBitir("depresyon");
      return;
    }

    // Sonraki tura geç
    this.sonrakiTuraGec();
  };

  // ============================================================
  // 50. SONRAKİ TURA GEÇ
  // ============================================================
  Oyun.prototype.sonrakiTuraGec = function () {
    const self = this;

    // Butonları kilitle
    const btnOde = document.getElementById("btn-vergi-ode");
    const btnReddet = document.getElementById("btn-vergi-reddet");
    if (btnOde) btnOde.disabled = true;
    if (btnReddet) btnReddet.disabled = true;

    setTimeout(function () {
      if (self.oyunBitti) return;

      // Butonları aç
      if (btnOde) btnOde.disabled = false;
      if (btnReddet) btnReddet.disabled = false;

      // Mesajı temizle
      const msg = document.getElementById("mesaj");
      if (msg) msg.textContent = "";

      // Sonraki vergi
      // (zamanGuncelle otomatik çağırır)
    }, 1200);
  };

  // ============================================================
  // 51. ETKİLEŞİM (E Tuşu)
  // ============================================================
  Oyun.prototype.etkilesim = function () {
    const d = this.durum;
    if (this.oyunBitti || d.aktifVergi || d.diyalogAcik) return;

    // Yatakta mı?
    const y = this.yatakKonum();
    const dxY = d.x - (y.x + y.w / 2);
    const dyY = d.y - (y.y + y.h / 2);
    if (Math.sqrt(dxY * dxY + dyY * dyY) < 60) {
      this.uyu();
      return;
    }

    // Markette mi?
    const m = this.marketKonum();
    const dxM = d.x - (m.x + m.w / 2);
    const dyM = d.y - (m.y + m.h / 2);
    if (Math.sqrt(dxM * dxM + dyM * dyM) < 70) {
      this.marketAc();
      return;
    }

    // NPC yakınlık kontrolü
    for (let i = 0; i < this.npcler.length; i++) {
      const n = this.npcler[i];
      const dx = d.x - n.x;
      const dy = d.y - n.y;
      if (Math.sqrt(dx * dx + dy * dy) < 50) {
        this.npcDiyalog(n);
        return;
      }
    }
  };

  // ============================================================
  // 52. NPC DİYALOG
  // ============================================================
  Oyun.prototype.npcDiyalog = function (npc) {
    let kategori;
    if (this.durum.moral < 30) kategori = "uzgun";
    else if (this.durum.moral > 70) kategori = "mutlu";
    else if (this.durum.aclik < 50) kategori = "sikayet";
    else kategori = "merhaba";

    const metin = window.VERGI.rastgeleSec(window.VERGI.NPC_DIYALOGLARI[kategori]);

    this.durum.diyalogAcik = true;

    // Diyalog kutusu
    const kutu = document.getElementById("diyalog-kutusu");
    if (kutu) {
      const avatarEl = document.getElementById("diyalog-avatar");
      const isimEl = document.getElementById("diyalog-isim");
      const metinEl = document.getElementById("diyalog-metin");
      if (avatarEl) avatarEl.textContent = "🧑";
      if (isimEl) isimEl.textContent = "Vatandaş";
      if (metinEl) metinEl.textContent = metin;
      kutu.classList.remove("gizli");
    }

    if (window.VERGI.Ses) window.VERGI.Ses.konusmaSesi();
  };

  Oyun.prototype.diyalogKapat = function () {
    this.durum.diyalogAcik = false;
    const kutu = document.getElementById("diyalog-kutusu");
    if (kutu) kutu.classList.add("gizli");
  };

  // ============================================================
  // 53. MARKET AÇ
  // ============================================================
  Oyun.prototype.marketAc = function () {
    const modal = document.getElementById("market-ekrani");
    if (!modal) return;

    // Modalı göster
    modal.classList.remove("gizli");
    this.duraklatildi = true;
    this.durum.marketteMi = true;

    // Market içeriğini oluştur
    this.marketRender();

    if (window.VERGI.Ses) window.VERGI.Ses.butonSesi();
  };

  Oyun.prototype.marketKapat = function () {
    const modal = document.getElementById("market-ekrani");
    if (modal) modal.classList.add("gizli");
    this.duraklatildi = false;
    this.durum.marketteMi = false;
  };

  // ============================================================
  // 54. MARKET RENDER
  // ============================================================
  Oyun.prototype.marketRender = function () {
    const liste = document.querySelector(".market-modal-liste");
    if (!liste) return;

    liste.innerHTML = "";

    const urunler = window.VERGI.MARKET_URUNLERI;
    const meslek = window.VERGI.meslekBul(this.durum.meslek);
    const indirim = (meslek && meslek.bonus && meslek.bonus.harcama_indirim) || 0;

    for (let i = 0; i < urunler.length; i++) {
      const u = urunler[i];
      const fiyat = Math.floor(u.fiyat * (1 - indirim));
      const yeterli = this.durum.para >= fiyat;

      const div = document.createElement("div");
      div.className = "market-urun";
      div.setAttribute("data-urun", u.id);
      div.setAttribute("data-fiyat", fiyat);

      div.innerHTML =
        '<div class="market-urun-ikon">' + u.ikon + "</div>" +
        '<div class="market-urun-bilgi">' +
          '<div class="market-urun-ad">' + u.ad + "</div>" +
          '<div class="market-urun-aciklama">' + u.aciklama + "</div>" +
        "</div>" +
        '<div class="market-urun-fiyat">' + window.VERGI.paraFormat(fiyat) + "</div>" +
        '<button class="market-urun-btn" data-al="' + u.id + '"' + (yeterli ? "" : " disabled") + ">Al</button>";

      liste.appendChild(div);
    }

    // Para güncelle
    const elPara = document.getElementById("market-para");
    if (elPara) elPara.textContent = window.VERGI.paraFormat(this.durum.para);
  };

  // ============================================================
  // 55. MARKET ÜRÜN AL
  // ============================================================
  Oyun.prototype.marketUrunAl = function (urunId, fiyat) {
    const d = this.durum;
    const urun = window.VERGI.marketUrunuBul(urunId);
    if (!urun) return;

    if (d.para < fiyat) {
      this.bildirimGoster("💸 Yeterli paran yok!", "kotu");
      if (window.VERGI.Ses) window.VERGI.Ses.hasarSesi();
      return;
    }

    // Parayı düş
    d.para -= fiyat;
    d.marketHarcama += fiyat;

    // Etki uygula
    if (urun.etki) {
      if (urun.etki.aclik) {
        d.aclik = Math.min(100, d.aclik + urun.etki.aclik);
      }
      if (urun.etki.moral) {
        d.moral = Math.min(100, d.moral + urun.etki.moral);
      }
    }

    // Envantere ekle
    d.envanter[urunId] = (d.envanter[urunId] || 0) + 1;

    // Ses
    if (window.VERGI.Ses) {
      window.VERGI.Ses.paraSesi();
    }

    // Bildirim
    this.bildirimGoster("🛒 " + urun.ad + " aldın!", "iyi");

    // Günlüğe yaz
    if (window.VERGI.Arayuz && window.VERGI.Arayuz.gunlugeYaz) {
      window.VERGI.Arayuz.gunlugeYaz(
        "🛒 " + urun.ad + " alındı: -" + window.VERGI.paraFormat(fiyat)
      );
    }

    // Rozet
    if (window.VERGI.Arayuz && window.VERGI.Arayuz.basarimKontrol) {
      window.VERGI.Arayuz.basarimKontrol("market_al", 1);
    }

    // Market'i yeniden render et
    this.marketRender();

    // Karakter konuşsun
    this.konus("Aldım bakalım... 🛍️", 1.5);
  };

  // ============================================================
  // 56. UYU
  // ============================================================
  Oyun.prototype.uyu = function () {
    const d = this.durum;
    const f = this.faz();

    if (f !== "gece") {
      this.bildirimGoster("☀️ Gündüz uyunmaz! Gece bekle.", "uyari");
      if (window.VERGI.Ses) window.VERGI.Ses.uyariSesi();
      return;
    }

    // Enerji kontrolü (açlık)
    if (d.aclik < 10) {
      this.bildirimGoster("🍞 Çok açsın, uyuyamazsın!", "kotu");
      return;
    }

    // Gün geç
    d.gun++;
    d.zaman = 0;
    d.sonVergiIndex = 0;
    d.moral = Math.min(100, d.moral + 10);
    d.aclik = Math.max(0, d.aclik - 15);
    d.uyuduMu = true;

    // Ses
    if (window.VERGI.Ses) {
      window.VERGI.Ses.sifaSesi();
    }

    // Bildirim
    this.bildirimGoster("😴 Uyudun... Gün " + d.gun + " başladı!", "iyi");

    // Günlüğe yaz
    if (window.VERGI.Arayuz && window.VERGI.Arayuz.gunlugeYaz) {
      window.VERGI.Arayuz.gunlugeYaz(
        "😴 Uyudun. Gün " + d.gun + " başladı."
      );
    }

    // Karakter konuşsun
    this.konus("Günaydın... 🥱", 2);

    // Gün bitti mi?
    if (d.gun > window.VERGI.SABITLER.MAX_GUN) {
      this.oyunBitir("idam");
      return;
    }

    // Başarım
    if (window.VERGI.Arayuz && window.VERGI.Arayuz.basarimKontrol) {
      window.VERGI.Arayuz.basarimKontrol("uyu", 1);
    }
  };

  // ============================================================
  // 57. OYUN BİTİR
  // ============================================================
  Oyun.prototype.oyunBitir = function (sebep) {
    if (this.oyunBitti) return;
    this.oyunBitti = true;
    this.duraklatildi = true;

    const d = this.durum;
    const sebepBilgi = window.VERGI.OLUM_SEBEPLERI[sebep] || window.VERGI.OLUM_SEBEPLERI.idam;

    // Skor hesapla
    const skor = this.skorHesapla();

    // Ses
    if (window.VERGI.Ses) {
      if (sebep === "kazandi") {
        window.VERGI.Ses.kazanmaSesi();
      } else {
        window.VERGI.Ses.kaybetmeSesi();
      }
    }

    // İstatistik kaydet
    if (window.VERGI.Kayit) {
      window.VERGI.Kayit.istatistikKaydet({
        skor: skor,
        sure: d.gun * this.gunSaniye,
        odenen: d.toplamOdenen,
        reddedilen: d.reddedilen,
        sebep: sebep,
      });
    }

    // Kazandıysa kazanma ekranı
    if (sebep === "kazandi") {
      this.kazanmaEkraniGoster(skor);
    } else {
      this.idamEkraniGoster(sebep, sebepBilgi, skor);
    }

    // Günlüğe yaz
    if (window.VERGI.Arayuz && window.VERGI.Arayuz.gunlugeYaz) {
      window.VERGI.Arayuz.gunlugeYaz("💀 " + sebepBilgi.baslik);
    }
  };

  // ============================================================
  // 58. SKOR HESAPLA
  // ============================================================
  Oyun.prototype.skorHesapla = function () {
    const d = this.durum;
    let skor = 0;

    skor += d.toplamOdenen * 0.5;       // Ödenen vergi
    skor += d.para * 0.3;                // Kalan para
    skor += d.gun * 500;                 // Gün başına
    skor += d.moral * 2;                 // Moral
    skor += d.aclik * 1;                 // Açlık
    skor -= d.reddedilen * 50;           // Red ceza
    skor -= d.vergiSayaci * 10;          // Vergi sayısı

    return Math.max(0, Math.floor(skor));
  };

  // ============================================================
  // 59. İDAM EKRANI GÖSTER
  // ============================================================
  Oyun.prototype.idamEkraniGoster = function (sebep, sebepBilgi, skor) {
    const d = this.durum;

    // Değerleri doldur
    const elBaslik = document.getElementById("idam-baslik") || document.getElementById("sonuc-baslik");
    const elSebep = document.getElementById("idam-sebep") || document.getElementById("sonuc-mesaj");
    const elGun = document.getElementById("idam-gun") || document.getElementById("son-gun");
    const elOdenen = document.getElementById("idam-odenen") || document.getElementById("son-toplam");
    const elSkor = document.getElementById("idam-skor");
    const elRed = document.getElementById("son-red");

    if (elBaslik) elBaslik.textContent = sebepBilgi.baslik;
    if (elSebep) elSebep.textContent = sebepBilgi.aciklama;
    if (elGun) elGun.textContent = Math.max(0, d.gun - 1);
    if (elOdenen) elOdenen.textContent = window.VERGI.paraFormat(d.toplamOdenen);
    if (elSkor) elSkor.textContent = skor;
    if (elRed) elRed.textContent = d.reddedilen;

    // İdam ekranını göster
    const ekran = document.getElementById("idam-ekrani") || document.getElementById("idam");
    if (ekran) {
      ekran.classList.add("aktif");
      ekran.classList.remove("gizli");
    }

    // Karakter konuşsun
    this.konus(sebepBilgi.konusma, 5);
  };

  // ============================================================
  // 60. KAZANMA EKRANI GÖSTER
  // ============================================================
  Oyun.prototype.kazanmaEkraniGoster = function (skor) {
    const d = this.durum;

    const elGun = document.getElementById("kazanma-gun");
    const elPara = document.getElementById("kazanma-para");
    const elOdenen = document.getElementById("kazanma-odenen");
    const elSkor = document.getElementById("kazanma-skor");

    if (elGun) elGun.textContent = d.gun - 1;
    if (elPara) elPara.textContent = window.VERGI.paraFormat(d.para);
    if (elOdenen) elOdenen.textContent = window.VERGI.paraFormat(d.toplamOdenen);
    if (elSkor) elSkor.textContent = skor;

    // Kazanma ekranını göster
    const ekran = document.getElementById("kazanma-ekrani");
    if (ekran) {
      ekran.classList.add("aktif");
      ekran.classList.remove("gizli");
    }

    // Konfeti
    if (window.VERGI.Animasyonlar && window.VERGI.Animasyonlar.konfetiYagdir) {
      window.VERGI.Animasyonlar.konfetiYagdir(100);
    }

    // Karakter konuşsun
    this.konus("HAYATTA KALDIM! 🎉", 5);
  };

  // ============================================================
  // 61. EKRAN SARSINTISI
  // ============================================================
  Oyun.prototype.ekranSars = function () {
    const kap = document.querySelector(".oyun-kap") || document.body;
    if (!kap) return;

    kap.classList.remove("ekran-sars");
    void kap.offsetWidth;
    kap.classList.add("ekran-sars");

    setTimeout(function () {
      kap.classList.remove("ekran-sars");
    }, 400);
  };

  // ============================================================
  // 62. KAYDET
  // ============================================================
  Oyun.prototype.kaydet = function (slotNo) {
    if (!window.VERGI.Kayit) return { ok: false, mesaj: "Kayıt sistemi yok!" };

    const veri = {
      x: this.durum.x,
      y: this.durum.y,
      gun: this.durum.gun,
      zaman: this.durum.zaman,
      para: this.durum.para,
      moral: this.durum.moral,
      aclik: this.durum.aclik,
      toplamOdenen: this.durum.toplamOdenen,
      reddedilen: this.durum.reddedilen,
      vergiSayaci: this.durum.vergiSayaci,
      envanter: this.durum.envanter,
      meslek: this.durum.meslek,
      kayitTarihi: new Date().toISOString(),
    };

    return window.VERGI.Kayit.slotKaydet(slotNo, veri);
  };

  // ============================================================
  // 63. YÜKLE
  // ============================================================
  Oyun.prototype.yukle = function (slotNo) {
    if (!window.VERGI.Kayit) return { ok: false, mesaj: "Kayıt sistemi yok!" };

    const kayit = window.VERGI.Kayit.slotYukle(slotNo);
    if (!kayit) return { ok: false, mesaj: "Kayıt bulunamadı!" };

    const v = kayit.veri;

    this.durum.x = v.x || 400;
    this.durum.y = v.y || 400;
    this.durum.gun = v.gun || 1;
    this.durum.zaman = v.zaman || 0;
    this.durum.para = v.para || 1000;
    this.durum.moral = v.moral || 60;
    this.durum.aclik = v.aclik || 100;
    this.durum.toplamOdenen = v.toplamOdenen || 0;
    this.durum.reddedilen = v.reddedilen || 0;
    this.durum.vergiSayaci = v.vergiSayaci || 0;
    this.durum.envanter = v.envanter || {};
    this.durum.meslek = v.meslek || "memur";

    this.oyunBitti = false;
    this.duraklatildi = false;

    return { ok: true, mesaj: "Kayıt yüklendi!" };
  };

  // ============================================================
  // 64. BAŞARIM KONTROL (Internal — Arayuz'a haber verir)
  // ============================================================
  Oyun.prototype.basarimKontrol = function (tip, deger) {
    if (window.VERGI.Arayuz && window.VERGI.Arayuz.basarimKontrol) {
      window.VERGI.Arayuz.basarimKontrol(tip, deger);
    }
  };

  // ============================================================
  // 65. TIKLAMA OLAYLARINI BAĞLA
  // ============================================================
  Oyun.prototype.tiklamaOlaylariniBagla = function () {
    const self = this;

    // Vergi öde
    const btnOde = document.getElementById("btn-vergi-ode");
    if (btnOde) {
      btnOde.addEventListener("click", function () {
        self.vergiOde();
      });
    }

    // Vergi reddet
    const btnReddet = document.getElementById("btn-vergi-reddet");
    if (btnReddet) {
      btnReddet.addEventListener("click", function () {
        self.vergiReddet();
      });
    }

    // Diyalog devam
    const btnDiyalog = document.getElementById("btn-diyalog-devam");
    if (btnDiyalog) {
      btnDiyalog.addEventListener("click", function () {
        self.diyalogKapat();
      });
    }

    // Market kapat
    const btnMarketKapat = document.getElementById("btn-market-kapat");
    if (btnMarketKapat) {
      btnMarketKapat.addEventListener("click", function () {
        self.marketKapat();
      });
    }

    // Market ürün al (event delegation)
    const marketListe = document.querySelector(".market-modal-liste");
    if (marketListe) {
      marketListe.addEventListener("click", function (e) {
        const btn = e.target.closest("[data-al]");
        if (!btn) return;
        const urunId = btn.getAttribute("data-al");
        const urun = window.VERGI.marketUrunuBul(urunId);
        if (!urun) return;
        const meslek = window.VERGI.meslekBul(self.durum.meslek);
        const indirim = (meslek && meslek.bonus && meslek.bonus.harcama_indirim) || 0;
        const fiyat = Math.floor(urun.fiyat * (1 - indirim));
        self.marketUrunAl(urunId, fiyat);
      });
    }

    // Envanter kapat
    const btnEnvKapat = document.getElementById("btn-envanter-kapat");
    if (btnEnvKapat) {
      btnEnvKapat.addEventListener("click", function () {
        self.envanterToggle();
      });
    }

    // Oyun menü devam
    const btnDevamEt = document.getElementById("btn-devam-et");
    if (btnDevamEt) {
      btnDevamEt.addEventListener("click", function () {
        const menu = document.getElementById("oyun-menu");
        if (menu) menu.classList.add("gizli");
        self.duraklatildi = false;
      });
    }

    // Oyun menü ana menü
    const btnAnaMenu = document.getElementById("btn-oyun-cikis");
    if (btnAnaMenu) {
      btnAnaMenu.addEventListener("click", function () {
        if (confirm("Ana menüye dönmek istediğine emin misin? İlerleme kaybolacak!")) {
          self.durdur();
          if (window.VERGI.Arayuz && window.VERGI.Arayuz.menuGoster) {
            window.VERGI.Arayuz.menuGoster();
          }
        }
      });
    }

    // İdam tekrar
    const btnIdamTekrar = document.getElementById("btn-idam-tekrar") ||
                          document.getElementById("btn-os-tekrar");
    if (btnIdamTekrar) {
      btnIdamTekrar.addEventListener("click", function () {
        self.yenidenBaslat();
      });
    }

    // İdam ana menü
    const btnIdamMenu = document.getElementById("btn-idam-menu") ||
                        document.getElementById("btn-os-menu");
    if (btnIdamMenu) {
      btnIdamMenu.addEventListener("click", function () {
        self.durdur();
        if (window.VERGI.Arayuz && window.VERGI.Arayuz.menuGoster) {
          window.VERGI.Arayuz.menuGoster();
        }
      });
    }

    // Kazanma tekrar
    const btnKazanmaTekrar = document.getElementById("btn-kazanma-tekrar");
    if (btnKazanmaTekrar) {
      btnKazanmaTekrar.addEventListener("click", function () {
        self.yenidenBaslat();
      });
    }

    // Kazanma ana menü
    const btnKazanmaMenu = document.getElementById("btn-kazanma-menu");
    if (btnKazanmaMenu) {
      btnKazanmaMenu.addEventListener("click", function () {
        self.durdur();
        if (window.VERGI.Arayuz && window.VERGI.Arayuz.menuGoster) {
          window.VERGI.Arayuz.menuGoster();
        }
      });
    }

    // Açlık uyarı tamam
    const btnAclikKapat = document.querySelector("#aclikUyari .btn-ode");
    if (btnAclikKapat) {
      btnAclikKapat.addEventListener("click", function () {
        const uyari = document.getElementById("aclikUyari");
        if (uyari) uyari.classList.add("gizli");
      });
    }

    // HUD envanter
    const hudEnv = document.getElementById("btn-hud-envanter");
    if (hudEnv) {
      hudEnv.addEventListener("click", function () {
        self.envanterToggle();
      });
    }

    // HUD menü
    const hudMenu = document.getElementById("btn-hud-menu");
    if (hudMenu) {
      hudMenu.addEventListener("click", function () {
        self.menuToggle();
      });
    }
  };

  // ============================================================
  // 66. YENİDEN BAŞLAT
  // ============================================================
  Oyun.prototype.yenidenBaslat = function () {
    // İdam ekranını kapat
    const idam = document.getElementById("idam-ekrani") || document.getElementById("idam");
    if (idam) {
      idam.classList.remove("aktif");
      idam.classList.add("gizli");
    }

    // Kazanma ekranını kapat
    const kazanma = document.getElementById("kazanma-ekrani");
    if (kazanma) {
      kazanma.classList.remove("aktif");
      kazanma.classList.add("gizli");
    }

    // Sıfırla
    const meslek = this.durum.meslek || "memur";
    this.sifirla(meslek);

    // Menüyü de kapat
    const menu = document.getElementById("oyun-menu");
    if (menu) menu.classList.add("gizli");

    // Tekrar başlat
    this.aktif = true;
    this.oyunBitti = false;
    this.duraklatildi = false;
    this.sonZaman = performance.now() / 1000;
    this.dongu();

    this.bildirimGoster("🔄 Yeniden başladın!", "iyi");
  };

  // ============================================================
  // 67. DEBUG BİLGİ
  // ============================================================
  Oyun.prototype.debugBilgi = function () {
    return {
      aktif: this.aktif,
      duraklatildi: this.duraklatildi,
      oyunBitti: this.oyunBitti,
      fps: this.fpsGoster,
      gun: this.durum.gun,
      zaman: Math.floor(this.durum.zaman),
      para: this.durum.para,
      moral: Math.floor(this.durum.moral),
      aclik: Math.floor(this.durum.aclik),
      x: Math.floor(this.durum.x),
      y: Math.floor(this.durum.y),
      faz: this.faz(),
      vergiSayaci: this.durum.vergiSayaci,
    };
  };

  // ============================================================
  // 68. PART 2 BAŞLAT (tıklama olayları)
  // ============================================================
  const _orijinalBaslat = Oyun.prototype.baslat;
  Oyun.prototype.baslat = function (secenekler) {
    _orijinalBaslat.call(this, secenekler);
    this.tiklamaOlaylariniBagla();
    this.hudGuncelle();
  };

  // ============================================================
  // PART 2 SONU
  // ============================================================
  console.log(
    "%c🎮 OYUN MODÜLÜ (PART 2) YÜKLENDİ",
    "color:#4ade80;font-size:12px;font-weight:bold;"
  );
})();