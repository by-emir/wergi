/* ============================================================
   ============================================================
   💸 VERGİ OYUNU — SES YÖNETİCİSİ
   ============================================================
   Bu dosya tüm ses efektlerini ve müzik yönetimini yapar.
   Global namespace: window.VERGI.Ses
   ============================================================
*/

(function () {
  "use strict";

  window.VERGI = window.VERGI || {};

  // ============================================================
  // SES YÖNETİCİSİ SINIFI
  // ============================================================
  function SesYoneticisi() {
    this.sesler = {};
    this.calisiyor = {};
    this.ayarlar = {
      ana: 0.7,
      muzik: 0.5,
      efekt: 0.8,
      sessiz: false,
    };
    this.muzik = null;
    this.muzikCalisiyor = false;
    this.ilkTiklama = false;
    this.yuklendi = false;
  }

  // ============================================================
  // 1. AYAR YÜKLEME / KAYDETME
  // ============================================================
  SesYoneticisi.prototype.ayarlariYukle = function () {
    try {
      const kayitli = localStorage.getItem("vergiOyunu_ses");
      if (kayitli) {
        const parsed = JSON.parse(kayitli);
        this.ayarlar = Object.assign(this.ayarlar, parsed);
      }
    } catch (e) {
      console.warn("Ses ayarları yüklenemedi:", e);
    }
    return this.ayarlar;
  };

  SesYoneticisi.prototype.ayarlariKaydet = function () {
    try {
      localStorage.setItem("vergiOyunu_ses", JSON.stringify(this.ayarlar));
    } catch (e) {
      console.warn("Ses ayarları kaydedilemedi:", e);
    }
  };

  // ============================================================
  // 2. SES EFEKTİ YÜKLE
  // ============================================================
  SesYoneticisi.prototype.sesYukle = function (isim, url) {
    if (this.sesler[isim]) return this.sesler[isim];

    const audio = new Audio();
    audio.preload = "auto";
    audio.volume = this.ayarlar.efekt;
    audio.src = url;

    audio.addEventListener("error", function () {
      // Ses dosyası yoksa sessizce geç
    });

    this.sesler[isim] = audio;
    return audio;
  };

  // ============================================================
  // 3. TÜM SESLERİ YÜKLE
  // ============================================================
  SesYoneticisi.prototype.tumSesleriYukle = function () {
    if (!window.VERGI.SESLER) {
      console.warn("VERGI.SESLER bulunamadı!");
      return;
    }

    const sesler = window.VERGI.SESLER;
    for (const isim in sesler) {
      if (Object.prototype.hasOwnProperty.call(sesler, isim)) {
        this.sesYukle(isim, sesler[isim]);
      }
    }

    this.yuklendi = true;
    console.log("🔊 Ses sistemi hazır (" + Object.keys(this.sesler).length + " ses)");
  };

  // ============================================================
  // 4. SES ÇAL
  // ============================================================
  SesYoneticisi.prototype.cal = function (isim, opsiyonlar) {
    if (this.ayarlar.sessiz) return;

    opsiyonlar = opsiyonlar || {};

    const ses = this.sesler[isim];
    if (!ses) {
      // Dosya yoksa Web Audio API ile beep sesi
      if (opsiyonlar.beep !== false) {
        this.beep(opsiyonlar.frekans || 440, opsiyonlar.sure || 100);
      }
      return;
    }

    try {
      // Aynı sesi klonla (üst üste çalabilmek için)
      const klon = ses.cloneNode();
      klon.volume = (opsiyonlar.ses || this.ayarlar.efekt) * this.ayarlar.ana;
      if (opsiyonlar.hiz) klon.playbackRate = opsiyonlar.hiz;

      // Çal
      const p = klon.play();
      if (p && typeof p.catch === "function") {
        p.catch(function () {
          // Otomatik oynatma engellendi, sessizce geç
        });
      }

      // Çalan sesleri takip et
      const id = isim + "_" + Date.now();
      this.calisiyor[id] = klon;

      const self = this;
      klon.addEventListener("ended", function () {
        delete self.calisiyor[id];
      });
    } catch (e) {
      // Hata olursa beep
      if (opsiyonlar.beep !== false) {
        this.beep(opsiyonlar.frekans || 440, opsiyonlar.sure || 100);
      }
    }
  };

  // ============================================================
  // 5. BEEP SESİ (Ses dosyası yoksa)
  // ============================================================
  SesYoneticisi.prototype.beep = function (frekans, sure, tip) {
    if (this.ayarlar.sessiz) return;

    try {
      // Web Audio Context
      if (!this.audioContext) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        this.audioContext = new AC();
      }

      const ctx = this.audioContext;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = tip || "square";
      osc.frequency.value = frekans || 440;

      const sesSeviyesi = this.ayarlar.efekt * this.ayarlar.ana * 0.15;
      gain.gain.setValueAtTime(sesSeviyesi, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + sure / 1000);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + sure / 1000);
    } catch (e) {
      // Sessizce geç
    }
  };

  // ============================================================
  // 6. HAZIR SES EFEKTLERİ (Fallback)
  // ============================================================
  SesYoneticisi.prototype.butonSesi = function () {
    if (this.sesler.buton) {
      this.cal("buton");
    } else {
      this.beep(800, 60, "square");
    }
  };

  SesYoneticisi.prototype.tikSesi = function () {
    if (this.sesler.tik) {
      this.cal("tik");
    } else {
      this.beep(1200, 30, "sine");
    }
  };

  SesYoneticisi.prototype.paraSesi = function () {
    if (this.sesler.para) {
      this.cal("para");
    } else {
      this.beep(880, 100, "sine");
      setTimeout(() => this.beep(1320, 100, "sine"), 80);
    }
  };

  SesYoneticisi.prototype.vergiSesi = function () {
    if (this.sesler.vergi) {
      this.cal("vergi");
    } else {
      this.beep(220, 400, "sawtooth");
    }
  };

  SesYoneticisi.prototype.uyariSesi = function () {
    if (this.sesler.uyari) {
      this.cal("uyari");
    } else {
      this.beep(880, 150, "square");
      setTimeout(() => this.beep(660, 150, "square"), 160);
    }
  };

  SesYoneticisi.prototype.kazanmaSesi = function () {
    if (this.sesler.kazanma) {
      this.cal("kazanma");
    } else {
      // Do-mi-sol-do
      const notalar = [523, 659, 784, 1047];
      notalar.forEach((f, i) => {
        setTimeout(() => this.beep(f, 200, "sine"), i * 150);
      });
    }
  };

  SesYoneticisi.prototype.kaybetmeSesi = function () {
    if (this.sesler.kaybetme) {
      this.cal("kaybetme");
    } else {
      const notalar = [523, 440, 349, 262];
      notalar.forEach((f, i) => {
        setTimeout(() => this.beep(f, 250, "sawtooth"), i * 200);
      });
    }
  };

  SesYoneticisi.prototype.adimSesi = function () {
    if (this.sesler.adim) {
      this.cal("adim", { ses: this.ayarlar.efekt * 0.3 });
    } else {
      this.beep(150, 30, "sine");
    }
  };

  SesYoneticisi.prototype.konusmaSesi = function () {
    if (this.sesler.konusma) {
      this.cal("konusma", { hiz: 1.5 });
    } else {
      this.beep(600, 50, "square");
    }
  };

  // ============================================================
  // 7. MÜZİK ÇAL / DURDUR
  // ============================================================
  SesYoneticisi.prototype.muzikCal = function () {
    if (this.ayarlar.sessiz) return;
    if (this.muzikCalisiyor) return;

    if (!this.muzik) {
      this.muzik = new Audio();
      this.muzik.src = window.VERGI.SESLER ? window.VERGI.SESLER.muzik : "";
      this.muzik.loop = true;
      this.muzik.volume = this.ayarlar.muzik * this.ayarlar.ana;
    }

    const p = this.muzik.play();
    if (p && typeof p.then === "function") {
      p.then(() => {
        this.muzikCalisiyor = true;
      }).catch(() => {
        // Otomatik çalma engellendi
      });
    }
  };

  SesYoneticisi.prototype.muzikDurdur = function () {
    if (this.muzik) {
      this.muzik.pause();
      this.muzikCalisiyor = false;
    }
  };

  SesYoneticisi.prototype.muzikToggle = function () {
    if (this.muzikCalisiyor) {
      this.muzikDurdur();
    } else {
      this.muzikCal();
    }
    return this.muzikCalisiyor;
  };

  // ============================================================
  // 8. SES SEVİYESİ AYARLAMA
  // ============================================================
  SesYoneticisi.prototype.anaSesAyarla = function (deger) {
    this.ayarlar.ana = Math.max(0, Math.min(1, deger / 100));
    this.guncelle();
    this.ayarlariKaydet();
  };

  SesYoneticisi.prototype.muzikSesAyarla = function (deger) {
    this.ayarlar.muzik = Math.max(0, Math.min(1, deger / 100));
    if (this.muzik) {
      this.muzik.volume = this.ayarlar.muzik * this.ayarlar.ana;
    }
    this.ayarlariKaydet();
  };

  SesYoneticisi.prototype.efektSesAyarla = function (deger) {
    this.ayarlar.efekt = Math.max(0, Math.min(1, deger / 100));
    this.guncelle();
    this.ayarlariKaydet();
  };

  SesYoneticisi.prototype.guncelle = function () {
    for (const isim in this.sesler) {
      if (Object.prototype.hasOwnProperty.call(this.sesler, isim)) {
        this.sesler[isim].volume = this.ayarlar.efekt * this.ayarlar.ana;
      }
    }
  };

  // ============================================================
  // 9. SESSİZ MOD
  // ============================================================
  SesYoneticisi.prototype.sessizToggle = function () {
    this.ayarlar.sessiz = !this.ayarlar.sessiz;

    if (this.ayarlar.sessiz) {
      this.muzikDurdur();
    } else {
      this.guncelle();
    }

    this.ayarlariKaydet();
    return this.ayarlar.sessiz;
  };

  // ============================================================
  // 10. TÜM SESLERİ DURDUR
  // ============================================================
  SesYoneticisi.prototype.hepsiniDurdur = function () {
    for (const id in this.calisiyor) {
      if (Object.prototype.hasOwnProperty.call(this.calisiyor, id)) {
        try {
          this.calisiyor[id].pause();
        } catch (e) {}
        delete this.calisiyor[id];
      }
    }
  };

  // ============================================================
  // 11. İLK TIKLAMA (Autoplay Politikası)
  // ============================================================
  SesYoneticisi.prototype.ilkTiklamaKur = function () {
    const self = this;

    function ilkEtkilesim() {
      if (self.ilkTiklama) return;
      self.ilkTiklama = true;

      // Web Audio Context'i başlat (kullanıcı etkileşimi sonrası)
      if (!self.audioContext) {
        try {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (AC) self.audioContext = new AC();
          if (self.audioContext.state === "suspended") {
            self.audioContext.resume();
          }
        } catch (e) {}
      }

      // Müziği başlat
      self.muzikCal();

      // Dinleyicileri kaldır
      document.removeEventListener("click", ilkEtkilesim);
      document.removeEventListener("touchstart", ilkEtkilesim);
      document.removeEventListener("keydown", ilkEtkilesim);
    }

    document.addEventListener("click", ilkEtkilesim, { once: true });
    document.addEventListener("touchstart", ilkEtkilesim, { once: true });
    document.addEventListener("keydown", ilkEtkilesim, { once: true });
  };

  // ============================================================
  // 12. SAYFA GÖRÜNÜRLÜK (Sekme Değişince)
  // ============================================================
  SesYoneticisi.prototype.sayfaGorunurlukIzle = function () {
    const self = this;

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        // Sekme arkaplana alındı → sesi kıs
        self.hepsiniDurdur();
        if (self.muzikCalisiyor) {
          self.muzik.pause();
          self.muzikCalisiyor = false;
        }
      } else {
        // Sekmeye geri dönüldü → müziği devam ettir (kullanıcı tıkladıysa)
        if (self.ilkTiklama && !self.ayarlar.sessiz) {
          self.muzikCal();
        }
      }
    });
  };

  // ============================================================
  // 13. ÖZEL EFEKT: KAZANMA MELODİSİ
  // ============================================================
  SesYoneticisi.prototype.zaferMelodisi = function () {
    const self = this;
    // Do mi sol do (yukarı)
    const notalar = [523, 659, 784, 1047, 1319];
    notalar.forEach(function (f, i) {
      setTimeout(function () {
        self.beep(f, 250, "sine");
      }, i * 180);
    });
  };

  // ============================================================
  // 14. ÖZEL EFEKT: KAYIP MELODİSİ
  // ============================================================
  SesYoneticisi.prototype.yenilgiMelodisi = function () {
    const self = this;
    // Do si la sol (aşağı)
    const notalar = [523, 494, 440, 392, 330];
    notalar.forEach(function (f, i) {
      setTimeout(function () {
        self.beep(f, 350, "triangle");
      }, i * 220);
    });
  };

  // ============================================================
  // 15. ÖZEL EFEKT: ALARM
  // ============================================================
  SesYoneticisi.prototype.alarmCal = function () {
    const self = this;
    for (let i = 0; i < 3; i++) {
      setTimeout(function () {
        self.beep(880, 200, "square");
      }, i * 300);
    }
  };

  // ============================================================
  // 16. ÖZEL EFEKT: PARA SAYMA
  // ============================================================
  SesYoneticisi.prototype.paraSaymaSesi = function () {
    const self = this;
    for (let i = 0; i < 5; i++) {
      setTimeout(function () {
        self.beep(1200 + i * 50, 60, "sine");
      }, i * 80);
    }
  };

  // ============================================================
  // 17. ÖZEL EFEKT: KALP ATIŞI
  // ============================================================
  SesYoneticisi.prototype.kalpAtisi = function () {
    const self = this;
    this.beep(80, 150, "sine");
    setTimeout(function () {
      self.beep(80, 150, "sine");
    }, 250);
  };

  // ============================================================
  // 18. ÖZEL EFEKT: ZIPLAMA
  // ============================================================
  SesYoneticisi.prototype.ziplamaSesi = function () {
    const self = this;
    // Yukarı doğru kayan frekans
    for (let i = 0; i < 5; i++) {
      setTimeout(function () {
        self.beep(400 + i * 100, 60, "sine");
      }, i * 40);
    }
  };

  // ============================================================
  // 19. ÖZEL EFEKT: HASAR
  // ============================================================
  SesYoneticisi.prototype.hasarSesi = function () {
    const self = this;
    this.beep(150, 200, "sawtooth");
    setTimeout(function () {
      self.beep(100, 250, "sawtooth");
    }, 150);
  };

  // ============================================================
  // 20. ÖZEL EFEKT: ŞİFA
  // ============================================================
  SesYoneticisi.prototype.sifaSesi = function () {
    const self = this;
    const notalar = [523, 659, 784, 1047];
    notalar.forEach(function (f, i) {
      setTimeout(function () {
        self.beep(f, 150, "sine");
      }, i * 100);
    });
  };

  // ============================================================
  // 21. ÖZEL EFEKT: SEVİYE ATLAMA
  // ============================================================
  SesYoneticisi.prototype.seviyeSesi = function () {
    const self = this;
    const notalar = [523, 659, 784, 1047, 1319, 1568];
    notalar.forEach(function (f, i) {
      setTimeout(function () {
        self.beep(f, 150, "triangle");
      }, i * 100);
    });
  };

  // ============================================================
  // 22. SES LİSTESİ (Debug)
  // ============================================================
  SesYoneticisi.prototype.sesListesi = function () {
    return Object.keys(this.sesler);
  };

  SesYoneticisi.prototype.ayarOzet = function () {
    return {
      ana: Math.round(this.ayarlar.ana * 100),
      muzik: Math.round(this.ayarlar.muzik * 100),
      efekt: Math.round(this.ayarlar.efekt * 100),
      sessiz: this.ayarlar.sessiz,
      muzikCalisiyor: this.muzikCalisiyor,
      toplamSes: Object.keys(this.sesler).length,
    };
  };

  // ============================================================
  // 23. BAŞLAT
  // ============================================================
  SesYoneticisi.prototype.baslat = function () {
    this.ayarlariYukle();
    this.tumSesleriYukle();
    this.ilkTiklamaKur();
    this.sayfaGorunurlukIzle();
    console.log("🎵 Ses yöneticisi başlatıldı:", this.ayarOzet());
  };

  // ============================================================
  // GLOBAL NESNE OLUŞTUR
  // ============================================================
  VERGI.Ses = new SesYoneticisi();

  // Kısayol (eski kodlar için)
  VERGI.ses = VERGI.Ses;

  console.log(
    "%c🔊 SES MODÜLÜ YÜKLENDİ",
    "color:#6ec6ff;font-size:12px;font-weight:bold;"
  );
})();